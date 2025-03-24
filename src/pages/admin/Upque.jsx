import React, { useState, useEffect, useRef } from 'react';
import "datatables.net-dt";
import $, { error } from "jquery";
import axios from 'axios';
import "../../assets/css/datatables-custom.css";


function Upque() {

  const [name, setName] = useState('nab')
  const [pertanyaan, setPertanyaan] = useState('nab')
  const [questions, setQuest] = useState([])
  const tableRef = useRef(null);

  const getQuest = async () => {
    await axios.get("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/questions")
      .then((response) => {
        console.log(response.data);
        setQuest(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const questSave = async (e) => {
    e.preventDefault();
    await axios.post("https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/questions", {
      id_type: name,
      question: pertanyaan,
    })
      .then((response) => {
        alert(response.data.message);
        getQuest();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      })
    // console.log(pertanyaan);
  }

  const questDelete = async (id) => {

    let konfirmasi = confirm(
      'Apakah yakin akan di hapus?'
    )
    if (konfirmasi) {
      await axios.delete(`https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/questions/${id}`)
        .then((response) => {
          alert(response.data.message);
          getQuest();
          navigate('/');
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const questUpdate=async(e)=>{
    await axios.put(`https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/questions/${id}`, {
      id_type: name,
      question: pertanyaan,
    })
      .then((response) => {
        alert(response.data.message);
        getQuest();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    getQuest();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && tableRef.current) {
      const existingDataTable = $(tableRef.current).DataTable();
      // existingDataTable.destroy();
      $(tableRef.current).DataTable();
    }
  }, [questions]);

  return (
    <div className='bg-sky-400 h-screen justify-center items-center p-4'>
      <div className='bg-orange-50 p-4 rounded-xl'>
        INPUT PERTANYAAN
      </div>
      <div className='grid grid-cols-2 gap-5 justify-center items-center'>
        <div className='bg-orange-100 p-4 my-4 mx-4 rounded-lg w-full'>
          <div className='bg-orange-50 p-4 mb-4 rounded-md'>
            FORM INPUT PERTANYAAN
          </div>
          <form action="" method="post" onSubmit={questSave}>
            <div className="mb-5">
              <label for="jenis_kecerdasan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Kecerdasan</label>
              <input type="text" id="jenis_kecerdasan" onChange={(e) => setName(e.target.value)} name="jenis_kecerdasan" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Masukkan Jenis Kecerdasan Di sini...' required />
            </div>
            <div className="mb-5">
              <label for="pertanyaan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pertanyaan</label>
              <textarea type="text" id="pertanyaan" onChange={(e) => setPertanyaan(e.target.value)} name="pertanyaan" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Masukkan Pertanyaan...' required></textarea>
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
                  Pertanyaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {
                questions.map((question, index) =>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {question.id_type}
                    </td>
                    <td className="px-6 py-4">
                      {question.question}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => questDelete(question.id)} className='m-4'>Hapus</button>
                      <button onClick={() => questUpdate(question.id, question.id_type)} className='m-4'>Update Modal</button>
                      <button onClick={() => questUpdate(question.id, question.id_type)}>Update Pindah Halaman</button>
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

export default Upque