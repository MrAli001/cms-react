import React from 'react'
import ReactDOM from 'react-dom'
import './AcceptModal.css'


export default function AcceptModal({ onCancel, onConfirm ,title }) {
    return ReactDOM.createPortal(
        <div className='modal-parent show-modal'>
            <div className="delete-modal">
                <h1>{title}</h1>
                <div className='delete-modal-btns'>
                    <button className='delete-btn delete-modal-accept-btn' onClick={() => onConfirm()}>بله</button>
                    <button className='delete-btn delete-modal-reject-btn' onClick={() => onCancel()}>خیر</button>
                </div>
            </div>
        </div>, document.getElementById('modals-parent')
    )
}
