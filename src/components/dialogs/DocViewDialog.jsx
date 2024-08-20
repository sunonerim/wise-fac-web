import * as React from 'react';
import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PdfView from 'components/frames/PdfView';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//======================= DocViewDialog =======================
export default function DocViewDialog({ open,  onClose, doc }){
  const doClose = () => {
    if ( onClose ) {
      onClose();
    }
  }

  let docUrl = `http://localhost:8080/wisemen/api/v1/viewer/${doc.id}/1`;

  if( doc.fileExtension === 'xls'
    || doc.fileExtension === 'xlsx'
    || doc.fileExtension === 'doc'
    || doc.fileExtension === 'docx' ){
      docUrl = `http://localhost:8080/wisemen/api/v1/viewer/${doc.id}/1`;
  } else {
    
  }
  return (    
    <React.Fragment>      
      <Dialog
        fullScreen
        open={open}
        onClose={doClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} color="primary">
          <Toolbar variant="dense">            
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{doc.name}</Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={doClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <PdfView docUrl={docUrl} />
      </Dialog>
    </React.Fragment>
  );
}