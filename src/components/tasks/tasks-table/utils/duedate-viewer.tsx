import React from "react";

const DuedateViewer = ({ date }: { date: string }) => {
  const dueDate = new Date(date);
  const today = new Date();
  const differenceInDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let textColor = "text-black";
  if (differenceInDays < 0) {
    textColor = "text-red-500";
  } else if (differenceInDays <= 3) {
    textColor = "text-yellow-500";
  } else if (differenceInDays <= 7) {
    textColor = "text-blue-500";
  } else {
    textColor = "text-green-500";
  }

  if (!date) {
    return;
  }

  return (
    <div className={`text-start font-medium ${textColor}`}>
      {dueDate.toISOString().split("T")[0]}
    </div>
  );
};

export default DuedateViewer;
