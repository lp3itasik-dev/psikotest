import React, { useState, useEffect, useRef } from 'react';
import "datatables.net-dt";
import $, { error } from "jquery";
import axios from 'axios';
import "../../assets/css/datatables-custom.css";

function Criteria() {

  const [name, setName] = useState('nab')
  const [types, setTypes] = useState([])
  const tableRef = useRef(null);

  const getType = async () => {
    await axios.get("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/types")
      .then((response) => {
        console.log(response.data);
        setTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const typeSave = async (e) => {
    e.preventDefault();
    await axios.post("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/types", {
      jenis_kecerdasan: name,
    })
      .then((response) => {
        alert(response.data.message);
        getType();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const typeDelete = async (id) => {

    let konfirmasi = confirm(
      'Apakah yakin akan di hapus?'
    )
    if (konfirmasi) {
      await axios.delete(`https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/types/${id}`)
        .then((response) => {
          alert(response.data.message);
          getType();
          navigate('/');
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const typeUpdate=async(e)=>{
    await axios.put(`https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/types/${id}`, {
      name: name,
    })
      .then((response) => {
        alert(response.data.message);
        getType();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    getType();
  }, []);

  useEffect(() => {
    if (types.length > 0 && tableRef.current) {
      const existingDataTable = $(tableRef.current).DataTable();
      // existingDataTable.destroy();
      $(tableRef.current).DataTable();
    }
  }, [types]);

  return (
    <div className='bg-sky-400 h-screen justify-center items-center p-4'>
      <div className='bg-orange-50 p-4 rounded-xl'>
        INPUT JENIS KECERDASAN
      </div>
      <div className='grid grid-cols-2 gap-5 justify-center items-center'>
        <div className='bg-orange-100 p-4 my-4 mx-4 rounded-lg w-full'>
          <div className='bg-orange-50 p-4 mb-4 rounded-md'>
            FORM INPUT JENIS KECERDASAN
          </div>
          <form action="" method="post" onSubmit={typeSave}>
            <div className="mb-5">
              <label for="jenis_kecerdasan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Kecerdasan</label>
              <input type="text" id="jenis_kecerdasan" onChange={(e) => setName(e.target.value)} name="jenis_kecerdasan" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Masukkan Jenis Kecerdasan Di sini...' required />
            </div>
            <button type='submit' className='bg-sky-500 w-16 p-2 justify-center items-center hover:bg-sky-600 hover:text-white rounded-md'>
              Submit
            </button>
          </form>
        </div>
        <div className='bg-orange-100 p-4 my-4 mx-4 rounded-lg'>
          <table ref={tableRef} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Jenis Kecerdasan
                </th>
                <th scope="col" className="px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {
                types.map((type, index) =>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {type.jenis_kecerdasan}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => typeDelete(type.id)} className='m-4'>Hapus</button>
                      <button onClick={() => typeUpdate(type.id, type.jenis_kecerdasan)} className='m-4'>Update Modal</button>
                      <button onClick={() => typeUpdate(type.id, type.jenis_kecerdasan)}>Update Pindah Halaman</button>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default Criteria