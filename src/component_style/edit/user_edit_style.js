let [width,paddingBottom] = window.screen.width <= 600 ? ["285px","60px"]: ["400px","0px"];
let userEditStyle = {
  userEdit: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: width,
    border: "1px solid #dbdbdb",
    borderRadius: "5px",
    padding: "20px",
    marginTop: "10px",
    paddingBottom:paddingBottom,
  },

  newImagePreviewDiv: {
    width: "200px",
    height: "200px",
  },

  newImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  imageSelector: {
    display: "none",
  },

  label: {
    border: "1px solid #8f8f9d",
    borderRadius: "5px",
    marginTop: "10px",
    padding: "4px",
  },

  textarea: {
    marginTop: "10px",
    width: "295px",
    height: "100px",
  },

  nameInput: {
    width: "295px",
    marginTop: "10px",
  },

  submitBtn: {
    marginTop: "10px",
  },
};

export default userEditStyle;
