import React from "react";

export default function PageHeader() {
  return (
    <div className="container">
      <div className="row justify-between py-30 mt-80">
        <div className="col-auto">
          <div className="text-14">
            Home {">"} Tours {">"} Tanzania 
          </div>
        </div>

        <div className="col-auto">
          <div className="text-14">Tours & Safaris</div>
        </div>
      </div>
    </div>
  );
}
