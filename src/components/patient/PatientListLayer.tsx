'use client';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Button from "../primitive/button/Button";

import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import Input from "../primitive/input/Input";
import InputFile from "../primitive/input-file/InputFile";
import Card from "../primitive/card/Card";
import RadioButton from "../primitive/radio-button/RadioButton";
import Select from "../primitive/select/Select";
import TextArea from "../primitive/textarea/TextArea";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import PatientModalForm from "./PatientModalForm";
const patiens = [
  { id: "1312341", name: "Produk A", phone_number: 100000 },
  { id: "2333123", name: "Produk B", phone_number: 150000 },
];

const PatientListLayer = () => {
  const [modalAddProduct, setModalAddProduct] = useState<boolean>(false);
  
  return (
    <>
    <Card
      renderHeader={
        <div className="d-flex flex-wrap justify-content-between">
          <div className='d-flex flex-wrap align-items-center gap-3'>
            <Input size="sm" icon="ion:search-outline" placeholder="Ketikan sesuatu" />
          
          </div>
          <div className='d-flex flex-wrap align-items-center gap-3'>
            <Select  options={[{label:"paid",value:"paid"}]} placeholder={"Select status"}/>
            <Button  onClick={()=>setModalAddProduct(true)}>
              <div className="d-flex flex-wraper gap-2">
              <Icon icon='ic:round-add' className='text-lg' />
              <span className="text-xs text-light fw-small"> Tambah pasien</span>
              </div>
            </Button>
            
          </div>
        </div>
      }
    >
      <table className='table bordered-table mb-0'>
        <thead>
          <tr>
            <th scope='col'>Nomor Pasien</th>
            <th scope='col'>Nama</th>
            <th scope='col'>Nomor Telepon</th>
            <th scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          {patiens.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href='/pasien/1' className='text-primary-600'>
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
              <td>{p.phone_number}</td>
              <td>
                <Link
                  href='pasien/1'
                  className=' w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='iconamoon:eye-light' />
                </Link>
                <button
                  onClick={() => setModalAddProduct(true)}
                  href='#'
                  className='w-32-px h-32-px  me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='lucide:edit' />
                </button>
                <ButtonDelete 
                  className="w-32-px h-32-px  me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                >
                  <Icon icon='mingcute:delete-2-line' />
                </ButtonDelete>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24'>
        <div className='d-flex align-items-center gap-2'>
          <span>Show</span>
          <select
            className='form-select form-select-sm w-auto'
            defaultValue='Select Number'
          >
            <option value='Select Number' disabled>
              Select Number
            </option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
          </select>
        </div>
        <span>Showing 1 to 10 of 12 entries</span>
        <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
          <li className='page-item'>
            <Link
              className='page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base'
              href='#'
            >
              <Icon icon='ep:d-arrow-left' className='text-xl' />
            </Link>
          </li>
          <li className='page-item'>
            <Link
              className='page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px'
              href='#'
            >
              1
            </Link>
          </li>
          <li className='page-item'>
            <Link
              className='page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px'
              href='#'
            >
              2
            </Link>
          </li>
          <li className='page-item'>
            <Link
              className='page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px'
              href='#'
            >
              3
            </Link>
          </li>
          <li className='page-item'>
            <Link
              className='page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base'
              href='#'
            >
              {" "}
              <Icon icon='ep:d-arrow-right' className='text-xl' />{" "}
            </Link>
          </li>
        </ul>
      </div>
    </Card>
      <PatientModalForm
        isOpen={modalAddProduct}
        onHide={() => setModalAddProduct(false)}
        onSuccess={() => setModalAddProduct(false)}
      />
    </>
  );
};

export default PatientListLayer;
