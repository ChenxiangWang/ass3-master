import React from 'react';
import ReactDOM from 'react-dom';
import AlertDialog from '../component/AlertDialog';

export function alertMsg (title, content, onOk) {
  const setOpen = (o) => {
    ReactDOM.render(
        <AlertDialog open={o} setOpen={setOpen} key={title} title={title} onOk={onOk} content={content}/>
        , document.getElementById('self_defined_alter_box'),
    );
  }
  setOpen(true);
}
