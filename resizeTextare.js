const resizeTextArea = (name) => {
  const el = document.getElementById("text-area" + (name ? name : ""));
  el.style.height = 0;
  el.style.height = el.scrollHeight + "px";
};
