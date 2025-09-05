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
import { DATA_PROMOS } from "./DATA";
import Checkbox from "../primitive/checkbox/Checkbox";

export default function PromoList(){

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
              <Link href='promo/create' className='btn btn-sm btn-primary-600 gap-2 d-flex'>
                <i className='ri-add-line' /> Buat Promo
              </Link>
            </div>
          </div>
        }
      >

        <table className='table bordered-table mb-0'>
          <thead>
            <tr>
              <th scope='col'>Nama Promo</th>
              <th scope='col'>Produk</th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {DATA_PROMOS.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/promo/${p.id}`} className='text-primary-600'>
                    #{p.id}
                  </Link>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                      {p.name}
                    </h6>
                  </div>
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

    </>
  )
}