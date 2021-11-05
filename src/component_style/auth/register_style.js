let [margin, marginTop] = window.screen.width > 600 ? ["30%", "10%"] : ["0px", "30%"];

let registerStyle = {
  regMain: {
    backgroundColor: "#ffffff",
    border: "1px solid #dbdbdb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: margin,
    marginRight: margin,
    marginTop: marginTop,
    height: "65vh",
  },

  regForm: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },

  input: {
    marginTop: "7px",
    height: "30px",
    border: "1px solid #dbdbdb",
    borderRadius: "3px",
    backgroundColor: "#fafafa",
  },

  submitBtn: {
    marginTop: "12px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#0095f6",
    border: "1px solid #0095f6",
    borderRadius: "3px",
    height: "25px",
  },

  loginLink: {
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "10px",
    color: "#03396c",
  },

  login: {
    marginTop: "16px",
    fontWeight: "bold",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default registerStyle;
