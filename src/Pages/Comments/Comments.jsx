import React, { useEffect, useState } from 'react'
import ErrorBox from '../../Components/ErrorBox/ErrorBox'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Components/Loader/Loader';
import TextModal from '../../Components/Modals/TextModal/TextModal';
import EditModal from '../../Components/Modals/EditModal/EditModal';
import { BsCursorText } from 'react-icons/bs'
import './Comments.css'
import AcceptModal from '../../Components/Modals/AcceptModal/AcceptModal';

export default function Comments() {

  const [allComments, setAllComments] = useState([])
  const [isInProgress, setIsInProgress] = useState(true)
  const [isShowTextModal, setIsShowTextModal] = useState(false)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [isShowAcceptModal, setIsShowAcceptModal] = useState(false)
  const [isShowRejectModal, setIsShowRejectModal] = useState(false)
  const [mainCommentText, setMainCommentText] = useState('')
  const [commentID, setCommentID] = useState(null)
  const [commentNewText, setCommentNewText] = useState('')


  useEffect(() => {
    fetchDatas()
  }, [])

  const fetchDatas = () => {
    setIsInProgress(true)
    fetch('http://localhost:8000/api/comments')
      .then(res => res.json())
      .then(data => {
        setAllComments(data.reverse())
        setTimeout(() => {
          setIsInProgress(false)
        }, 2000);
      })
      .catch(err => console.warn(err))
  }

  // text modal action
  const closeTextModal = () => {
    setIsShowTextModal(false)
    setMainCommentText('')
  }

  // delete modal action
  const deleteModalConfirmAction = () => {
    fetch(`http://localhost:8000/api/comments/${commentID}`, {
      method: 'DELETE'
    }).then(res => {
      console.log(res);
      fetchDatas()
      successNotify('کامنت با موفقیت حذف شد')
    }).catch(err => {
      console.log(err);
      errorNotify('حذف کامنت موفقیت آمیز نبود')
    })
    setIsShowDeleteModal(false)
    setCommentID(null)
  }
  const deleteModalCancelAction = () => {
    setIsShowDeleteModal(false)
    setCommentID(null)
  }

  // edit modal actions 
  const editModalConfirmAction = () => {

    let newCommentText = {
      body: commentNewText
    }

    fetch(`http://localhost:8000/api/comments/${commentID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newCommentText)
    }).then(res => {
      console.log(res);
      fetchDatas()
      successNotify('متن کامنت با موفقیت تغییر کرد')
    }).catch(err => {
      console.log(err);
      errorNotify('تغییر متن کامنت موفقیت آمیز نبود')
    })

    setIsShowEditModal(false)
    setCommentID(null)
    setCommentNewText('')
  }

  const editModalCancelAction = () => {
    setIsShowEditModal(false)
    setCommentID(null)
  }

  // accpet comment actions

  const acceptModalConfirmAction = () => {
    setIsShowAcceptModal(false)
    fetch(`http://localhost:8000/api/comments/accept/${commentID}`, {
      method: 'POST'
    }).then(res => {
      console.log(res);
      fetchDatas()
      successNotify('کامنت با موفقیت تایید شد')
    }).catch(err => {
      console.log(err);
      errorNotify('تایید کامنت موقیت آمیز نبود')
    })
  }
  const acceptModalCancelAction = () => {
    setIsShowAcceptModal(false)
  }

  // reject modal actions
  const rejectModalConfirmAction = () => {
    setIsShowRejectModal(false)
    fetch(`http://localhost:8000/api/comments/reject/${commentID}`, {
      method: 'POST'
    }).then(res => {
      console.log(res);
      fetchDatas()
      successNotify('کامنت با موفقیت رد شد')
    }).catch(err => {
      console.log(err);
      errorNotify('رد کامنت موقیت آمیز نبود')
    })
  }
  const rejectModalCancelAction = () => {
    setIsShowRejectModal(false)
  }

  //* notify
  const successNotify = (toastMessage) => {
    toast.success(toastMessage, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const errorNotify = (toastMessage) => {
    toast.error(toastMessage, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  return (
    <>

      <div className="comments-table">

        {
          isInProgress && (
            <Loader />
          )
        }
        {
          allComments.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>نام کاربر</th>
                  <th>محصول</th>
                  <th>تاریخ</th>
                  <th>ساعت</th>
                  <th>متن کامنت</th>
                </tr>
              </thead>
              <tbody>
                {
                  allComments.map((comment) => (
                    <tr key={comment.id}>
                      <td>{comment.userID}</td>
                      <td>{comment.productID}</td>
                      <td>{comment.date}</td>
                      <td>{comment.hour}</td>
                      <td>
                        <button className="comments-table-btn" onClick={() => {
                          setIsShowTextModal(true)
                          setMainCommentText(comment.body)
                        }}>
                          دیدن کامنت
                        </button>
                      </td>
                      <td>
                        <button className="comments-table-btn" onClick={() => {
                          setIsShowDeleteModal(true)
                          setCommentID(comment.id)
                        }}>حذف</button>
                        <button className="comments-table-btn" onClick={() => {
                          setIsShowEditModal(true)
                          setCommentID(comment.id)
                        }}>ویرایش</button>
                        <button className="comments-table-btn">پاسخ</button>
                        {
                          comment.isAccept == 0 ? (
                            <button className="comments-table-btn" onClick={() => {
                              setIsShowAcceptModal(true)
                              setCommentID(comment.id)
                            }}>تایید</button>
                          ) : (
                            <button className="comments-table-btn" onClick={() => {
                              setIsShowRejectModal(true)
                              setCommentID(comment.id)
                            }}>رد</button>
                          )
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ) : (
            <ErrorBox ErrMessage={'کامنتی یافت نشد!'} />
          )
        }
        {
          isShowTextModal && <TextModal closeBtn={closeTextModal} commentText={mainCommentText} />
        }
        {
          isShowDeleteModal && <AcceptModal onConfirm={deleteModalConfirmAction} onCancel={deleteModalCancelAction} title={'آیا از حذف اطمینان دارید؟'} />
        }
        {
          isShowEditModal && <EditModal onSubmit={editModalConfirmAction} onClose={editModalCancelAction}>
            <div className="edit-form-group">
              <BsCursorText />
              <input type="text" className="edit-form-input" placeholder='متن جدید ...' value={commentNewText} onChange={(e) => {
                setCommentNewText(e.target.value)
              }} />
            </div>
          </EditModal>
        }
        {
          isShowAcceptModal && <AcceptModal onConfirm={acceptModalConfirmAction} onCancel={acceptModalCancelAction} title={'آیا از تایید کامنت اطمینان دارید؟'} />
        }
        {
          isShowRejectModal && <AcceptModal onConfirm={rejectModalConfirmAction} onCancel={rejectModalCancelAction} title={'آیا از رد کامنت اطمینان دارید؟'} />
        }
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
