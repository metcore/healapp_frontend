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
import Badge from "../primitive/badge/Badge";
import ProductBadge from "./ProductTypeBadge";
import { formatNumber, formatNumberRupiah } from "@/helper/formatNumber";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import LabelInput from "../primitive/label-input/LabelInput";
import Input from "../primitive/input/Input";
import Select from "../primitive/select/Select";
import CreatableSelect from "../primitive/select/CreatableSelect";
import { optionCategories } from "../category/helpers";
import ButtonGroup from "../primitive/button/ButtonGorup";
import InputNumber from "../primitive/input-number/InputNumber";
import Table from "../primitive/table/Table";
import Pagination from "../primitive/pagination/Pagination";
import { useDebouncedCallback } from 'use-debounce';

const products = DATA_PRODUCTS

type ProductListProps = {
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
    is_active: boolean;
    action:boolean;
  },
  onChecked?: (ids: string[]) => void;
  perPage: number,
  totalPage: number,
  totalRows: number,

}
export default function ProductList({
  exportImport = true,
  addProduct = true,
  search = true,
  showRow = {
    checkbox: true,
    sku: true,
    name: true,
    price: true,
    stock: true,
    is_active: true,
    action: true,
    sold:true,
    type:true,
  },
  perPage=10,
  totalPage= 20,
  totalRows = 10000,
  onChecked,

}: ProductListProps) {
  const [show, setShow] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModalSelectedItem, setShowModalSelectedItem] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckAll = () => {
    let newIds: string[] = [];
    if (selectedIds.length === products.length) {
      newIds = [];
    } else {
      newIds = products.map((p) => p.id);
    }
    setSelectedIds(newIds);
    onChecked?.(newIds); // 🔹 kirim ke parent
  };

  const handleCheck = (id: string) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      
      onChecked?.(newIds); // 🔹 kirim ke parent
      return newIds;
    });
  };

  const handleOnClickButtonFilter = () => {
    setIsOpenModalFilter(true)
  }

  const handleSearch = useDebouncedCallback((term)=>{
    console.log(term.target.value)
    setLoadingSearch(true)
  }, 300)

  return (
    <>
      <Card
        renderHeader={
          <div className="d-flex flex-wrap gap-2 justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="input-group">
                <Input
                  placeholder="Ketikan sesuatu"
                  name="search"
                  icon="mdi:search"
                  onChange={handleSearch}
                  loading={loadingSearch}
                />
                <Button size="sm">
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon={"mdi:search"} />
                    Cari
                  </div>
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline-primary"
                onClick={handleOnClickButtonFilter}
                className="d-flex align-items-center gap-2"
              >
                <Icon icon={"mdi:filter"} />
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
            {
              selectedIds.length > 0 ? (
                <div className="d-flex gap-2">
                  <Button size="sm">{selectedIds.length} Data terpilih</Button>
                  <Button variant="outline-secondary" size="sm">Non Aktif</Button>
                  <Button variant="outline-secondary" size="sm"> Aktif</Button>
                </div>
              ) : ""
            }
          <Table
            data={products}
            columns={[
              {
                attribute: "id",
                label:"Nama Product",
                show: showRow?.checkbox,
                header: () => (
                  <Checkbox
                    name={`product-check-all`}
                    onChange={handleCheckAll}
                    checked={selectedIds.length === products.length}
                  />
                ),
                value: (data) => (
                  <Checkbox
                    name="product-check"
                    value={data.id}
                    checked={selectedIds.includes(data.id)}
                    onChange={() => handleCheck(data.id)}
                  />
                )
              },
              
              {
                attribute: "name",
                label:"Nama Product",
                show: showRow?.name,
                value: (data) => data.name
              },
              {
                attribute: "sku",
                label:"SKU",
                show: showRow?.sku,
                value: (data) => (
                  <Link href={`/product/${data.id}`} className='text-primary-600'>
                    #{data.sku}
                  </Link>
                )
              },
              {
                attribute: "price",
                label:"Harga",
                show: showRow?.price,
                value: (data) => (
                  <div className='d-flex align-items-center '>
                    <h6 className='text-md mb-0 fw-medium flex-grow-1 text-end'>
                      {formatNumberRupiah(data.price)}
                    </h6>
                  </div>
                )
              },
              {
                attribute: "type",
                label:"Type",
                show: showRow?.type,
                value: (data) => (
                  <ProductBadge type={data.type} />
                )
              },
              {
                attribute: "stock",
                label:"Stok",
                show: showRow?.stock,
                value: (data) => (<p className="text-end">{formatNumber(data.stock)}</p>)
              },
              {
                attribute: "sold",
                label:"Terjual",
                show: showRow?.sold,
                value: (data) => (<p className="text-end">{formatNumber(data.sold)} </p>)
              },
              {
                attribute: "is_active",
                label:"Aktif",
                show: showRow?.is_active ,
                value: (data) => (<Switch name={`product[${data.id}]`} checked={data.is_active}/>)
              },
              {
                attribute: "action",
                label:"Action",
                filter:false,
                sortable:false,
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
        </div>
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
                <InputNumber name="min_price" placeholder="Harga minimum" />
                <InputNumber name="max_price1" placeholder="Harga maximum" />
              </div>
            </div>
            <div>
              <LabelInput label="Penjualan" />
              <div className="d-flex gap-2">
                <InputNumber name="min_quantity" placeholder="Quantiti minimum" />
                <InputNumber name="max_quantity" placeholder="Quantiti maximum" />
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
