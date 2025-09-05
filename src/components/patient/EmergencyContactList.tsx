import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
const emergencyContacts = [
  { id: "1312341", name: "Ayu samtsetianingsih", phone_number: 6289604038338, email: "metcore2@gmail.com", addres: "jl guru saliin rt 004/05 no 59", hubungan:"Istri" },
  { id: "1312241", name: "Slamet Riyadi", phone_number: 6289604038338, email: "metcore2@gmail.com", addres: "jl guru saliin rt 004/05 no 59", hubungan:"Istri" },
];

const EmergencyContactList = () => {
  return (
    <table className='table bordered-table mb-0'>
        <thead>
        <tr>
            <th scope='col'>Nama</th>
            <th scope='col'>Nomor Telepon</th>
            <th scope='col'>Email</th>
            <th scope='col'>Address</th>
            <th scope='col'>Hubungan</th>
        </tr>
        </thead>
        <tbody>
        {emergencyContacts.map((p) => (
          <tr key={p.id}>
            <td>
                <div className='d-flex align-items-center'>
                <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    {p.name}
                </h6>
                </div>
            </td>
            <td>{p.phone_number}</td>
            <td>{p.email}</td>
            <td>{p.addres}</td>
            <td>{p.hubungan}</td>
          </tr>
        ))}
        </tbody>
    </table>
  );
};

export default EmergencyContactList;
