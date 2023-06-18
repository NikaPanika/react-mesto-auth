import React from 'react';

function PopupWithForm({title, name, children, isOpen, onClose, onSubmit, buttonText, isLoading}) {
    return (
        <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
            <div className="popup__container">
                <button className="popup__close-button" type="button" onClick={onClose}></button>
                <h2 className="popup__header">{title}</h2>
                <form className="popup__form popup__form_data_profile" name={name} onSubmit={onSubmit}>
                    {children}
                    <button className="popup__save-button" type="submit">{ isLoading ? buttonText + "..." : buttonText}</button>
                </form>
            </div>
        </div>
    );
}

export default PopupWithForm;