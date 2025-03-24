import axios from 'axios';
import Lottie from 'lottie-react';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import elephantLP3I from '../assets/animations/elephant.json';

import LoadingScreen from './LoadingScreen'
import ServerError from './errors/ServerError'

const Result = () => {
  const [user, setUser] = useState({});
  const [result, setResult] = useState(null);

  const [errorPage, setErrorPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getInfo = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('LP3IPSY:token');
      if (!token) {
        return navigate('/');
      }

      const decoded = jwtDecode(token);
      setUser(decoded.data);

      const fetchProfile = async (token) => {
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        const data = {
          id: decoded.data.id,
          name: profileData.applicant.name,
          email: profileData.applicant.email,
          phone: profileData.applicant.phone,
          school: profileData.applicant.school,
          class: profileData.applicant.class,
          status: decoded.data.status,
        };
        setUser(data);
        getResult(data);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v2', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3IPSY:token', newToken);
            const newProfileData = await fetchProfile(newToken);
            const data = {
              id: decodedNewToken.data.id,
              name: newProfileData.applicant.name,
              email: newProfileData.applicant.email,
              phone: newProfileData.applicant.phone,
              school: newProfileData.applicant.school,
              class: newProfileData.applicant.class,
              status: decodedNewToken.data.status,
            };
            setUser(data);
            getResult(data);
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3IPSY:token');
              navigate('/');
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          localStorage.removeItem('LP3IPSY:token');
          setErrorPage(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3IPSY:token');
          navigate('/');
        } else {
          console.error('Unexpected HTTP error:', error);
          setErrorPage(true);
        }
      } else if (error.request) {
        console.error('Network error:', error);
        setErrorPage(true);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const getResult = async (data) => {
    await axios
      .get(
        `https://psikotest-kecerdasan-backend.politekniklp3i-tasikmalaya.ac.id/hasils/${data.id}`
      )
      .then((response) => {
        if (!response.data) {
          return navigate("/home");
        }
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logoutFunc = () => {
    localStorage.removeItem("LP3IPSY:token");
    localStorage.removeItem("LP3IPSY:bucket");
    navigate("/");
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className="bg-sky-500 flex justify-center items-center md:h-screen py-10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-5">
            <section className="flex flex-col items-center gap-3">
              <Lottie animationData={elephantLP3I} loop={true} className="h-52" />
              <div className="inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2">
                <h3 className="text-white font-bold text-lg">{user.name}</h3>
                <hr />
                <p className="text-sm text-white">
                  Jenis Kecerdasan Kamu adalah
                </p>
                {result ? (
                  <h2
                    className="text-2xl text-white uppercase font-bold"
                    id="result"
                  >
                    {result.jenis_kecerdasan}
                  </h2>
                ) : (
                  <p className="text-sm text-white">Loading..</p>
                )}
              </div>
              <button
                type="button"
                onClick={logoutFunc}
                className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-2 rounded-xl text-sm"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Keluar
              </button>
            </section>
            {result ? (
              <section className="max-w-7xl grid grid-cols-1 gap-5 overflow-y-auto p-5 h-screen">
                <div className="flex flex-col items-center justify-center text-center bg-sky-600 rounded-3xl px-10 py-5 space-y-2">
                  <h2 className="text-2xl text-white uppercase font-bold">
                    {result.jenis_kecerdasan}
                  </h2>
                  <div className="text-white space-y-1">
                    {result.keterangan.split(/([:.])/).map((sentence, index) => (
                      <div key={index}>
                        {index % 4 === 0 ? (
                          <h3 className="text-amber-400 text-base font-medium">
                            {sentence.trim()}
                          </h3>
                        ) : sentence.trim() !== ":" ? (
                          <p className="text-[13px] font-reguler">
                            {sentence.trim()}...
                          </p>
                        ) : null}
                        {(index + 1) % 2 === 0 || null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <p className="text-sm text-white">Loading..</p>
            )}
          </div>
        </main>
      )
    )
  );
};

export default Result;
