import { Icon } from "@iconify/react";
import Link from "next/link";

const vitals = [
  { id: "1312341", date: "1 Juli 2025", blod: 125, heart_beat: 122, temp: 34, weight: 65, height:125 },
  { id: "131221", date: "3 April 2025", blod: 130, heart_beat: 119, temp: 39, weight: 12, height:133 },
];

export default function PatientVitalHistory(){
  return(
    <>
    
      <table className='table bordered-table mb-0'>
        <thead>
          <tr>
            <th scope='col'>Tanggal</th>
            <th scope='col'>Tekanan Darah</th>
            <th scope='col'>Detak Jantung</th>
            <th scope='col'>Suhu</th>
            <th scope='col'>Berat</th>
            <th scope='col'>Tinggi</th>
          </tr>
        </thead>
        <tbody>
          {vitals.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href='/pasien/1' className='text-primary-600'>
                  #{p.date}
                </Link>
              </td>
              <td>
                <div className='d-flex align-items-center'>
                  <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    {p.blod}
                  </h6>
                </div>
              </td>
              <td>{p.heart_beat}</td>
              <td>{p.temp}</td>
              <td>{p.weight}</td>
              <td>{p.height}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}