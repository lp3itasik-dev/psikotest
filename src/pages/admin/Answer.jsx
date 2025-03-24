import React, { useState, useEffect, useRef } from 'react';
import "datatables.net-dt";
import $, { error } from "jquery";
import axios from 'axios';
import "../../assets/css/datatables-custom.css";

function Answer() {

  const [name, setName] = useState('nab')
  const [types, setTypes] = useState([])
  const [tests, setTests] = useState([])
  const tableRef = useRef(null);

  const getType = async () => {
    await axios.get("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/types")
      .then((response) => {
        // console.log(response.data);
        setTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getTest = async () => {
    await axios.get("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/tests")
      .then((response) => {
        console.log(response.data);
        setTests(response.data);
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
    getTest();
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
        JAWABAN
      </div>
      <div className='grid grid-cols-1 gap-5 justify-center items-center'>
        <div className='bg-orange-100 p-4 my-4 mx-4 rounded-lg'>
          <table ref={tableRef} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Kecerdasan
                </th>
                <th scope="col" className="px-6 py-3">
                  Pertanyaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {
                tests.map((test, index) =>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {test.Question.Type.jenis_kecerdasan}
                    </td>
                    <td className="px-6 py-4">
                      {test.Question.question}
                    </td>
                    <td className="px-6 py-4">
                      {test.score}
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default Answer