import React from "react";

function EventCard() {
  return (
    <div className="w-full">
      <div className="flex flex-row flex-wrap">
        <div className="border w-full flex flex-col rounded-lg shadow-md overflow-hidden truncate cursor-pointer">
          <div className=" ">
            <img
              src="https://s3-ap-southeast-1.amazonaws.com/loket-production-sg/images/banner/20240528022521.jpg"
              alt=""
              className="object-cover h-32"
            />
          </div>
          <div className="p-3 gap-2 flex flex-col">
            <div className="text-md ">Musikal Keluarga Cemara</div>
            <div className="text-md">17 January 2024</div>
            <div className="font-bold">IDR 120.000</div>
            <div className="border my-2" />

            <div className="flex flex-row  gap-2">
              <div className="rounded-full h-6 w-6">
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/loket-production-sg/images/organization/20240528101652.png"
                  alt=""
                />
              </div>
              <div>PT Visinema</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
