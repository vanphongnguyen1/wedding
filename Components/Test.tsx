"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles


// import required modules
import { Pagination } from 'swiper/modules';

const slides = [
  "/images/album 20x30 doc_03.JPG",
  "/images/album 20x30 doc_05.JPG",
  "/images/album 20x30 doc_06.JPG",
  "/images/album 20x30 doc_07.JPG",
  "/images/album 20x30 doc_08.JPG",
  "/images/album 20x30 doc_09.JPG",
  "/images/album 20x30 doc_10.JPG",
  "/images/album 20x30 doc_12.JPG",
];

export default function Test() {
  return <div className='pl-6'>      <Swiper
    // slidesPerView={'auto'}
    // spaceBetween={30}
    loop={true}
    slidesPerView={3.2}
  spaceBetween={10}
    pagination={{
      clickable: true,
    }}
    modules={[Pagination]}
    className="mySwiper bg-[#cccccc]"
  >
    <SwiperSlide className="w-[470px]">
        <div className=' h-[388px] bg-[#986501]'>
            Slide 1
        </div>
    </SwiperSlide>
    <SwiperSlide className="w-[470px]">
        <div className=' h-[388px] bg-[#986501]'>
            Slide 2
        </div>
    </SwiperSlide>
    <SwiperSlide className="w-[470px]">
        <div className='h-[388px] bg-[#986501]'>
            Slide 3
        </div>
    </SwiperSlide>
    <SwiperSlide className="w-[470px]">
        <div className=' h-[388px] bg-[#986501]'>
            Slide 4
        </div>
    </SwiperSlide>
    <SwiperSlide className="w-[470px]">
        <div className=' h-[388px] bg-[#986501]'>
            Slide 5
        </div>
    </SwiperSlide>

  </Swiper></div>
  }
