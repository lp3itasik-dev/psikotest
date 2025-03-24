import React from 'react';
import Lottie from 'lottie-react';
import preloader from '../../assets/img/load.json';

const Loader = () => {
    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
            <div className='bg-black bg-opacity-30 z-20 w-full flex justify-center items-center h-screen'>
                <div className='flex justify-center items-center'>
                    <Lottie animationData={preloader} loop={true} className='h-64' />
                </div>
            </div>
        </div>
    );
}

export default Loader;
