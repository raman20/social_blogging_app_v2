let postStyle = {
  all: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #dbdbdb",
    borderRadius: "5px",
    width: "550px",
    minHeight: "100px",
    padding: "15px",
    marginBottom: "20px",
  },

  postHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  postHeaderMeta: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  postHeaderUname: {
    marginLeft: "10px",
  },

  postHeaderImg: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },

  postBodyImg: {
    width: "100%",
  },

  postBodyText: {
    fontSize: "20px",
  },

  postButtons: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
    marginTop: "12px",
  },

  likeSection: {
    display: "flex",
    alignItems: "center",
  },

  likeCount: {
    marginLeft: "10px",
    fontSize: "14px",
  },

  commentCount: {
    fontSize: "14px",
  },

  commentSection: {
    fontSize: "14px",
    marginTop: "10px",
  },

  commentSectionForm: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },

  commentInput: {
    width: "92%",
    border: "none",
  },

  "commentInput:focus": {
    outline: "none",
  },

  commentButton: {
    marginLeft: "10px",
  },

  postList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default postStyle;
