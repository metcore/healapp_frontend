'use client'
import Card from "@/components/primitive/card/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Switch from "../primitive/switch/Switch";
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputFile from "../primitive/input-file/InputFile";
import { Alert, DropdownButton } from "react-bootstrap";
import Checkbox from "../primitive/checkbox/Checkbox";
import { DATA_ADDITIONAL_COSTS } from "./DATA";
import ModalFormAdditionalCost from "./ModalFormAdditionalCost";
import { formatNumberPercent, formatNumberRupiah } from "@/helper/formatNumber";


type AdditionalCostProps = {
  exportImport?: boolean;
  addProduct?: boolean;
  search?: boolean;
  showRow: {
    id:boolean;
    checkbox:boolean;
    name:boolean;
    amount:boolean;
    action:boolean;
    is_active:boolean;
  }
}
export default function AdditionalCostList({
  exportImport = true,
  addProduct = true,
  search = true,
  showRow = {
    checkbox: true,
    id: true,
    name: true,
    amount: true,
    action:true,
    is_active:true,
  },
}: AdditionalCostProps) {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState<boolean>(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


  const handleCheckAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]); // uncheck semua
    } else {
      setSelectedIds(products.map((p) => p.id)); // check semua
    }
  };

  const handleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
              {
                addProduct ? (
                  <Button size="sm" onClick={()=>setIsOpenModalCreate(true)}>
                    <div className="d-flex gap-2 ">
                    <i className='ri-add-line' /> Buat Additional Cost
                    </div>
                  </Button>
                ) : ""
              }
            </div>
          </div>
        }
      >
        <Alert variant="info" >
          <p className="mb-0">Data biaya tambaan akan muncul secara <b>otomatis</b> ketika melakukan <b>transaksi</b></p>
        </Alert>
        <table className='table bordered-table mb-0'>
          <thead>
            <tr>
              
              {showRow?.checkbox ? ( 
                <th scope='col'>
                  <Checkbox
                    onChange={handleCheckAll}
                    checked={selectedIds.length === DATA_ADDITIONAL_COSTS.length}
                  />
                </th>) : 
              ""}
              {showRow?.name ? ( <th scope='col'>Nama</th>) : ""}
              {showRow?.amount ? ( <th scope='col'>Amount</th>) : ""}
              {showRow?.is_active? ( <th scope='col'>Active</th>) : ""}
              {showRow?.action ? ( <th scope='col'>Action</th>) : ""}
            </tr>
          </thead>
          <tbody>
            {DATA_ADDITIONAL_COSTS.map((p) => (
              <tr key={p.id}>
                {showRow?.checkbox ? (
                <td>
                  <Checkbox
                    name="id"
                    value={p.id}
                    checked={selectedIds.includes(p.id)}
                    onChange={() => handleCheck(p.id)}
                  />
                </td>
                ) :"" }
                {showRow?.name ? (
                  <td>
                    <div className='d-flex align-items-center'>
                      <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                        {p.name}
                      </h6>
                    </div>
                  </td>
                ): ""}
                {showRow?.amount ? (
                  <td> 
                    <div className='d-flex align-items-center'>
                      <h6 className='text-md mb-0 fw-medium flex-grow-1 text-end'>
                        { 
                         p.type_amount =="nominal" ? formatNumberRupiah(p.amount) : formatNumberPercent(p.amount)
                        }
                      </h6>
                    </div>
                  </td>
                ): ""}
                {showRow?.amount ? (
                  <td>
                    <Switch
                      checked={p.is_active}
                    />
                  </td>
                ): ""}
                {showRow?.action ? (
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
                ): ""}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ModalFormAdditionalCost
        isOpen={isOpenModalCreate}
        onClose={()=>setIsOpenModalCreate(false)}
      />
    </>
  );
}
