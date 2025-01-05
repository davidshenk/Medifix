const refreshPage = () => window.location.reload();

const currentPath = window.location.pathname;

const handleCallClick = (e, phone) => {
  e.stopPropagation();
  window.location.href = `tel:${phone}`;
};

export { refreshPage, currentPath, handleCallClick };
