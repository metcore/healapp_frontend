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
import { DATA_VOUCHERS } from "./DATA";
import { formatNumber } from "@/helper/formatNumber";

export default function VoucherList(){

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
              
              <DropdownButton title="Export / Import" size="sm">
                <div className="d-flex gap-2 flex-column">
                <Link
                  className='btn btn-primary-600 btn-sm'
                  href='#'
                >
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon='lucide:file' />
                    Export
                  </div>
                </Link>
                <Button
                  size="sm"
                  onClick={handleShow}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon='lucide:file' />
                    Import
                  </div>
                </Button>
                  </div> 
              </DropdownButton>
              <Link href='voucher/create' className='btn btn-sm btn-primary-600 gap-2 d-flex'>
                <i className='ri-add-line' /> Buat Voucher
              </Link>
            </div>
          </div>
        }
      >

        <table className='table bordered-table mb-0'>
          <thead>
            <tr>
              <th scope='col'>Nama Promo</th>
              <th scope='col'>Code</th>
              <th scope='col'>Total Kuota</th>
              <th scope='col'>Total Terpakai</th>
              <th scope='col'>Sisa Quota</th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {DATA_VOUCHERS.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className='d-flex align-items-center'>
                    <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                      {p.name}
                    </h6>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <p className='text-md mb-0 fw-medium'>
                      {p.code}
                    </p>
                    <Button variant="outline" >
                      <Icon icon={"mdi:content-copy"} />
                    </Button>
                  </div>
                </td>
                <td className="text-end">
                  {formatNumber(p.quota)}
                </td>
                <td className="text-end">
                  { formatNumber(p.quota_used)}
                </td>
                <td className="text-end">
                  { formatNumber(p.quota - p.quota_used)}
                </td>
                <td><Switch/></td>
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
                        <Link
                          className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2'
                          href='#'
                        >
                          <Icon icon='mingcute:delete-2-line' />
                          Hapus
                        </Link>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title><h6>Petunjuk Import Data</h6></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <h6 className="mb-1 fw-semibold">Langkah-langkah:</h6>

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

    </>
  )
}