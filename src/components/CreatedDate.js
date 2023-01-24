const CreatedDate = ({ createdDate }) => {
  const formatDate =
    createdDate &&
    createdDate.toDate().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return <span>{formatDate}</span>;
};

export default CreatedDate;
