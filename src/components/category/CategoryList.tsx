'use client'
import Card from "@/components/primitive/card/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Switch from "../primitive/switch/Switch";
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import InputFile from "../primitive/input-file/InputFile";
import { DropdownButton } from "react-bootstrap";
import Checkbox from "../primitive/checkbox/Checkbox";
import { DATA_CATEGORIES } from "./DATA";
import Button from "../primitive/button/Button";
import ModalFormCategory from "./ModalFormCategory";
import Pagination from "../primitive/pagination/Pagination";
import Table from "../primitive/table/Table";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";

const products = [
  { id: "1312341", name: "Produk A", price: 100000, stock: 10 },
  { id: "2333123", name: "Produk B", price: 150000, stock: 12},
];

type CategoryListProps = {
  exportImport?: boolean;
  addProduct?: boolean;
  search?: boolean;
  showRow: {
    id:boolean;
    checkbox:boolean;
    name:boolean;
    price:boolean;
    stock:boolean;
    active: boolean;
    action:boolean;
  }
}
export default function CategoryList({
  exportImport = true,
  addProduct = true,
  search = true,
  showRow = {
    checkbox: true,
    id: true,
    name: true,
    price: true,
    stock: true,
    active: true,
    action: true,
  },
}: CategoryListProps) {
  const [show, setShow] = useState(false);
  const [isOpenModalCategory, setIsOpenModalCategory] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckAll = () => {
    if (selectedIds.length === DATA_CATEGORIES.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(DATA_CATEGORIES.map((p) => p.id));
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
                  <Button
                    onClick={() => setIsOpenModalCategory(true)}
                    size="sm"
                  >
                    <i className='ri-add-line' /> Buat kategori
                  </Button>
                ) : ""
              }
            </div>
          </div>
        }
      >
        <Table 
          data={DATA_CATEGORIES}
          columns={[
            {
              attribute: "name",
              label:"Nama Kategori",
            },
            {
              attribute: "action",
              filter:false,
              sortable:false,
              label:"Action",
              show: showRow?.action,
              value: (data) => (
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
                      <ButtonDelete variant="link">
                        <div className="d-flex gap-2 align-items-center">
                        <Icon icon='mingcute:delete-2-line' />
                        <p className="mb-0">Hapus</p>
                        </div>
                      </ButtonDelete>
                    </li>
                  </ul>
                </div>
              )
            },
          ]}
        />
        <Pagination
          total={1000}
          perPage={10}
          page={9}
        />
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

      <ModalFormCategory
        isOpen={isOpenModalCategory}
        onClose={()=>setIsOpenModalCategory(false)}
      />

    </>
  );
}
