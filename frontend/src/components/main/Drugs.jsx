import React, { useEffect, useState } from "react";
import { http } from "../../http/http";
import moment from "moment";
import Axios from "axios";

const Drugs = (props) => {
  const [filter, setFilter] = useState("/obat/get-obat");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [drugs, setDrugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [sold, setSold] = useState("");
  const [qty, setQty] = useState(0);
  const [addDrug, setAddDrug] = useState(false);
  const [addNamaObat, setAddNamaObat] = useState("");
  const [addHargaObat, setAddHargaObat] = useState(0);
  const [addStokObat, setAddStokObat] = useState(0);
  const [addKadaluarsaObat, setAddKadaluarsaObat] = useState("");

  useEffect(() => {
    Axios.get(`${http}${filter}`)
      .then((result) => {
        setMaxPage(Math.ceil(result.data.length / 5));
        setIsLoading(false);
        Axios.get(`${http}${filter}`, {
          params: {
            page: (page - 1) * 5,
            item: 5,
          },
        })
          .then((result) => {
            setDrugs(result.data);
          })
          .catch((err) => {
            setIsLoading(false);
            setHttpError(err.message);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        setHttpError(err.message);
      });
  }, [filter, page, sold, addDrug]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section>
        <p>{httpError}</p>
      </section>
    );
  }

  const onSold = (drug) => {
    setSold(drug.kodeObat);
  };

  const onCancelEdit = () => {
    setSold("");
  };

  const onSaveTransaction = (drug, quantity, qty) => {
    Axios.patch(`${http}/obat/edit-obat/${sold}`, {
      sisaObat: quantity,
    })
      .then(() => {
        setSold("");
        Axios.get(`${http}/transaksi/get-transaksi`)
          .then((result) => {
            Axios.post(`${http}/transaksi/add-transaksi`, {
              idTransaksi: `TRK0${result.data.length + 1}`,
              kodeObat: drug.kodeObat,
              jumlahJual: qty,
              kodeApoteker: "AP002",
              tanggalBeli: moment().format("YYYY-MM-DD"),
            })
              .then(() => console.log("Transaksi berhasil ditambahkan"))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const drugList = drugs.map((drug, index) => {
    let total = drug.jumlahJual * drug.hargaObat;
    if (filter === "/obat/get-obat") {
      if (drug.kodeObat === sold) {
        return (
          <tr key={index}>
            <th scope="row">{drug.kodeObat}</th>
            <td>{drug.namaObat}</td>
            <td>{drug.hargaObat.toLocaleString("id")}</td>
            <td>
              <input
                type="number"
                min={0}
                max={drug.sisaObat}
                className="form-control w-25 mx-auto text-center"
                onChange={(e) => setQty(e.target.value)}
              />
            </td>
            <td>{moment(drug.tanggalKadaluarsa).format("DD/MM/YYYY")}</td>
            <td>
              <button
                className="btn btn-primary me-2"
                onClick={() =>
                  onSaveTransaction(drug, drug.sisaObat - qty, qty)
                }
              >
                <i className="fas fa-truck"></i>
              </button>
              <button className="btn btn-danger me-2" onClick={onCancelEdit}>
                <i className="fas fa-times"></i>
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <th scope="row">{drug.kodeObat}</th>
          <td>{drug.namaObat}</td>
          <td>{drug.hargaObat.toLocaleString("id")}</td>
          <td>{drug.sisaObat}</td>
          <td>{moment(drug.tanggalKadaluarsa).format("DD/MM/YYYY")}</td>
          <td>
            {drug.sisaObat === 0 ? (
              <button className="btn btn-success me-2" disabled>
                <i className="fas fa-cart-arrow-down"></i>
              </button>
            ) : (
              <button
                className="btn btn-success me-2"
                onClick={() => onSold(drug)}
              >
                <i className="fas fa-cart-arrow-down"></i>
              </button>
            )}
          </td>
        </tr>
      );
    }
    if (filter === "/obat/get-new-obat") {
      return (
        <tr key={index}>
          <th scope="row">{drug.kodeObat}</th>
          <td>{drug.namaObat}</td>
          <td>{drug.hargaObat.toLocaleString("id")}</td>
          <td>{drug.sisaObat}</td>
          <td>{moment(drug.tanggalKadaluarsa).format("DD/MM/YYYY")}</td>
        </tr>
      );
    }
    if (filter === "/transaksi/get-transaksi") {
      return (
        <tr key={index}>
          <th scope="row">{moment(drug.tanggalBeli).format("DD/MM/YYYY")}</th>
          <td>{drug.namaObat}</td>
          <td>{drug.jumlahJual}</td>
          <td>{drug.hargaObat.toLocaleString("id")}</td>
          <td>{total.toLocaleString("id")}</td>
          <td>{drug.namaApoteker}</td>
        </tr>
      );
    }
    return drugList;
  });

  const onFilter = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const headers = () => {
    if (filter === "/obat/get-obat") {
      return <h3 className="text-center display-6">ADMIN</h3>;
    }
    if (filter === "/obat/get-new-obat") {
      return <h3 className="text-center display-6">OBAT MASUK</h3>;
    }
    if (filter === "/transaksi/get-transaksi") {
      return <h3 className="text-center display-6">OBAT KELUAR</h3>;
    }
  };

  const tableHead = () => {
    if (filter === "/obat/get-obat") {
      return (
        <tr>
          <th scope="col">Kode Obat</th>
          <th scope="col">Nama Obat</th>
          <th scope="col">Harga</th>
          <th scope="col">{sold !== "" ? "Terjual" : "Stok"}</th>
          <th scope="col">Kadaluarsa</th>
          <th scope="col">Action</th>
        </tr>
      );
    }
    if (filter === "/obat/get-new-obat") {
      return (
        <tr>
          <th scope="col">Kode Obat</th>
          <th scope="col">Nama Obat</th>
          <th scope="col">Harga</th>
          <th scope="col">Stok</th>
          <th scope="col">Kadaluarsa</th>
        </tr>
      );
    }
    if (filter === "/transaksi/get-transaksi") {
      return (
        <tr>
          <th scope="col">Tanggal Transaksi</th>
          <th scope="col">Nama Obat</th>
          <th scope="col">Terjual</th>
          <th scope="col">Harga per obat</th>
          <th scope="col">Total Penjualan</th>
          <th scope="col">Apoteker</th>
        </tr>
      );
    }
  };

  const onAddDrugs = () => {
    Axios.get(`${http}/obat/get-obat`)
      .then((result) => {
        Axios.post(`${http}/obat/add-obat`, {
          kodeObat: `CM0${result.data.length + 1}`,
          namaObat: addNamaObat,
          hargaObat: addHargaObat,
          sisaObat: addStokObat,
          tanggalKadaluarsa: moment(addKadaluarsaObat).format("YYYY-MM-DD"),
        })
          .then(
            () => setAddNamaObat(""),
            setAddHargaObat(0),
            setAddStokObat(0),
            setAddKadaluarsaObat(""),
            setAddDrug(!addDrug)
          )
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const nextPage = () => {
    if (page < maxPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container-fluid row mt-3">
      <div className="row justify-content-start">
        <div className="col-4">
          <select className="form-control" onChange={onFilter}>
            <option value="/obat/get-obat">Admin Dashboard</option>
            <option value="/obat/get-new-obat">Obat Masuk</option>
            <option value="/transaksi/get-transaksi">Obat Keluar</option>
          </select>
        </div>
        <div className="col-4">{headers()}</div>
      </div>
      <div className="col-12">
        <div className="d-flex flex-wrap  align-items-center flex-row justify-content-center">
          <table className="table table-hover text-center">
            <thead>{tableHead()}</thead>
            <tbody>
              {drugList}
              <tr>
                {addDrug && (
                  <>
                    <th scope="row"></th>
                    <td>
                      <input
                        type="text"
                        className="form-control mx-auto text-center"
                        onChange={(e) => setAddNamaObat(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control w-50 mx-auto text-center"
                        onChange={(e) => setAddHargaObat(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        className="form-control w-25 mx-auto text-center"
                        onChange={(e) => setAddStokObat(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control w-75 mx-auto text-center"
                        onChange={(e) => setAddKadaluarsaObat(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary me-2"
                        onClick={onAddDrugs}
                      >
                        <i className="fas fa-plus-square"></i>
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => setAddDrug(!addDrug)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </>
                )}
                {!addDrug && filter === "/obat/get-obat" ? (
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => setAddDrug(!addDrug)}
                    >
                      OBAT BARU
                    </button>
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
          ;
        </div>
      </div>
      <div className="mt-3 mb-2">
        <div className="d-flex flex-row justify-content-center align-items-center">
          <button className="btn btn-success" onClick={prevPage}>
            {"<"}
          </button>
          <div className="text-center mx-2">
            <strong>
              Page {page} of {maxPage}
            </strong>
          </div>
          <button className="btn btn-success" onClick={nextPage}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drugs;
