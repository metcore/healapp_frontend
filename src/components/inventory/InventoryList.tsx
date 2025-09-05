'use client'
import Card from "@/components/primitive/card/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Switch from "../primitive/switch/Switch";
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputFile from "../primitive/input-file/InputFile";
import { DropdownButton } from "react-bootstrap";
import Checkbox from "../primitive/checkbox/Checkbox";
import { DATA_PRODUCTS } from "./DATA";
import { formatNumber, formatNumberRupiah } from "@/helper/formatNumber";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import LabelInput from "../primitive/label-input/LabelInput";
import CreatableSelect from "../primitive/select/CreatableSelect";
import { optionCategories } from "../category/helpers";
import ButtonGroup from "../primitive/button/ButtonGorup";
import InputNumber from "../primitive/input-number/InputNumber";

const products = DATA_PRODUCTS

type InventoryListProps = {
  exportImport?: boolean;
  addProduct?: boolean;
  search?: boolean;
  showRow: {
    sku:boolean;
    checkbox:boolean;
    name:boolean;
    price:boolean;
    sold:boolean;
    type:boolean;
    stock:boolean;
    active: boolean;
    action:boolean;
  }
}
export default function InventoryList({
  exportImport = true,
  addProduct = true,
  search = true,
  showRow = {
    checkbox: true,
    sku: true,
    name: true,
    price: true,
    stock: true,
    active: true,
    action: true,
    sold:true,
    type:true,
  },
}: InventoryListProps) {
  const [show, setShow] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOnClickButtonFilter = () => {
    setIsOpenModalFilter(true)
  }

  return (
    <>
      <Card
        renderHeader={
          <div className="d-flex flex-wrap gap-2 justify-content-between">
            <div className='d-flex flex-wrap align-items-center gap-3'>
              <div className='icon-field'>
                <input
                  type='text'
                  name='#0'
                  className='form-control form-control-sm w-auto'
                  placeholder='Search'
                />
                <span className='icon'>
                  <Icon icon='ion:search-outline' />
                </span>
              </div>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={handleOnClickButtonFilter}
                className=" d-flex align-items-center gap-2"
              >
                <Icon icon={"mdi:filter"}/>
                Filter
              </Button>
            </div>
            <div className='d-flex flex-wrap align-items-center gap-3'>
              <select
                className='form-select form-select-sm w-auto'
                defaultValue='Select Status'
              >
                <option value='Select Status' disabled>
                  Select Status
                </option>
                <option value='Paid'>Paid</option>
                <option value='Pending'>Pending</option>
              </select>
              {
                exportImport ? ( 
                  <DropdownButton title="Export / Import" size="sm">
                    <div className="d-flex gap-2 flex-column">
                    <Link
                      className='btn btn-outline'
                      href='#'
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Icon icon='lucide:file' />
                        Export
                      </div>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleShow}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Icon icon='lucide:file' />
                        Import
                      </div>
                    </Button>
                      </div> 
                  </DropdownButton>
                ) : ""
              }
              {
                addProduct ? (
                  <Link href='product/create' className='btn btn-sm btn-primary-600 gap-2 d-flex'>
                    <i className='ri-add-line' /> Buat Produk
                  </Link>
                ) : ""
              }
            </div>
          </div>
        }
      >
        <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm">Non Aktif</Button>
            <Button variant="outline-secondary" size="sm"> Aktif</Button>
          </div>
          <table className='table bordered-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>Sku</th>
                <th scope='col'>Nama Produk</th>
                <th scope='col'>Cabang</th>
                <th scope='col'>Stok Awal</th>
                <th scope='col'>Stok masuk</th>
                <th scope='col'>Stok Keluar</th>
                <th scope='col'>Stok Akhir</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  
                  <td>
                    <Link href={`/product/${p.id}`} className='text-primary-600'>
                      #{p.sku}
                    </Link>
                  </td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                        {p.name}
                      </h6>
                    </div>
                  </td>
                  <td>{p.cabang}</td>
                  <td className="text-end">{formatNumber(p.stock_awal)}</td>
                  <td className="text-end">{formatNumber(p.stock_masuk)}</td>
                  <td className="text-end">{formatNumber(p.stock_keluar)}</td>
                  <td className="text-end">{formatNumber(p.stock_akhir)}</td>
                  <td>
                    <div className='dropdown'>
                      <button
                        className='btn btn-outline '
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                      >
                        <Icon icon='entypo:dots-three-vertical' className='menu-icon' />
                      </button>
                      <ul className='dropdown-menu'>
                        <li>
                          <Link
                            className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2'
                            href='#'
                          >
                            <Icon icon='iconamoon:eye-light' />
                            Lihat Detail
                          </Link>
                        </li>
                        <li>
                          <Link
                            className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2'
                            href='#'
                          >
                            <Icon icon='lucide:edit' />
                            Update
                          </Link>
                        </li>
                        <li>
                          <ButtonDelete variant="outline">
                            <div className="d-flex gap-2 align-items-center">
                            <Icon icon='mingcute:delete-2-line' />
                            <p className="mb-0">Hapus</p>
                            </div>
                          </ButtonDelete>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title><h6>Petunjuk Import Data</h6></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-1">
            <h6 className="mb-1 fw-semibold mb-0">Langkah-langkah:</h6>
            
            <ol className="ps-3">
              <li>Unduh template data terlebih dahulu</li>
              <li>Edit atau sesuaikan data sesuai kebutuhan</li>
              <li>Simpan file hasil edit</li>
              <li>Import kembali file tersebut ke sistem</li>
            </ol>

            <div>
              <Button variant="success" size="sm">
                <div className="d-flex gap-2 align-items-center">
                  <Icon icon="lucide:download" />
                  Unduh Template
                </div>
              </Button>
            </div>
            <InputFile  title="Unggah data" description="Masukan data file xls kamu yang sudah kamu sesuaikan ya, jangan sampai salah yah."/>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isOpenModalFilter} onHide={()=>setIsOpenModalFilter(false)}>
        <Modal.Header closeButton>
          Filter
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <div>
              <CreatableSelect 
                options={optionCategories} 
                label={"Kategori"}
                isMulti
              />
            </div>
            <div>
              <ButtonGroup 
                label={"Type item"}
                options={[
                  {label:'product', value:'product'},
                  {label:'treatment', value:'treatment'},
                ]}
              />
            </div>
            <div>
              <LabelInput label="Harga" />
              <div className="d-flex gap-2">
                <InputNumber  placeholder="Harga minimum" />
                <InputNumber  placeholder="Harga maximum" />
              </div>
            </div>
            <div>
              <LabelInput label="Penjualan" />
              <div className="d-flex gap-2">
                <InputNumber  placeholder="Quantiti minimum" />
                <InputNumber  placeholder="Quantiti maximum" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setIsOpenModalFilter(false)}>
            Tutup
          </Button>
          <Button variant="primary" onClick={()=>setIsOpenModalFilter(false)}>
            Filter
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
