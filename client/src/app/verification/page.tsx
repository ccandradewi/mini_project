import React, { Suspense } from "react";
import ResendEmailVerif from "./_component/ResendEmailVerif";

function VerifyPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResendEmailVerif />;
      </Suspense>
    </>
  );
}

export default VerifyPage;
