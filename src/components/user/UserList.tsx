'use client'
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Pagination from "../primitive/pagination/Pagination";
import Table from "../primitive/table/Table";
import Checkbox from "../primitive/checkbox/Checkbox";
import { DropdownButton, Image } from "react-bootstrap";
import Switch from "../primitive/switch/Switch";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import Card from "../primitive/card/Card";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Input from "../primitive/input/Input";
import Button from "../primitive/button/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/slice/user/userSlice";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation'

const DEFAULT_PER_PAGE = 1;
const UserList = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);  
  const dispatch = useDispatch<AppDispatch>()
  const { users, page, total, loading } = useSelector(
    (state: RootState) => state.users
  );
  const [show, setShow] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const searchParams = useSearchParams(); // ✅ hook di body component

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
    setLoadingSearch(true)
  }, 300)

  useEffect(() => {
    dispatch(fetchUsers({
      page: page,
      per_page: DEFAULT_PER_PAGE
    }))
    setCurrentPage(1)
  }, [dispatch])

  const handleOnChangePagination = (p: number) => {
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    params.set('search', 'slamet');

    router.push(`${window.location.pathname}?${params.toString()}`);
    dispatch(
      fetchUsers({
        page: p,
        per_page: DEFAULT_PER_PAGE
      }),
    );
    setCurrentPage(p)
  }
  
  useEffect(() => {
   
  }, [])
  return (
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
            <Link href='user/create' className='btn btn-sm btn-primary-600 gap-2 d-flex'>
              <i className='ri-add-line' /> Buat Pengguna
            </Link>
          </div>
        </div>
      }
    >
      <Table
        // onFilterChange={(e)=>console.log(e)}
        // onSortChange={(e)=>console.log(users)}
        url="/users"
        columns={[
          {
            attribute:"id",
            sortable: false,
            filter:false,
            label:"Name",
            header: () => (
              <Checkbox
                name={`product-check-all`}
              />
            ),
            value: (data) => (
              <Checkbox
                name="product-check"
                value={data.id}
              />
            )
          },
          {
            attribute:"Name",
            sortable: true,
            label:"Name",
            value: (data) => (
              <div className='d-flex align-items-center'>
                <Image
                  src={data.image}
                  roundedCircle
                  className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                />
                <div className='flex-grow-1'>
                  <span className='text-md mb-0 fw-normal text-secondary-light'>
                    {data.Name}
                  </span>
                </div>
              </div>
            )
          },
          {
            attribute:"Email",
            sortable: true,
            label:"Email",
          },
          {
            attribute:"phone_number",
            label:"Phone",
          },
          {
            attribute:"Role",
            label:"Role",
            filter:"select",
            filterOptions: [
              { label: "SUPERADMIN", value: "SUPERADMIN" },
              { label: "Dokter", value: "DOCTOR" },
              { label: "Therapist", value: "THERAPIST" },
            ],
          },
          {
            attribute:"IsActive",
            label:"Active",
            value: (data)=> (
              <Switch name="IsActive[]" checked={data.IsActive} />
            )
          },
          
          {
            attribute: "action",
            label:"Action",
            sortable:false,
            filter:false,
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
                      <Icon icon='iconamoon:send' />
                      Kirim Email Verifikasi
                    </Link>
                  </li>
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
    </Card>
  );
};

export default UserList;
