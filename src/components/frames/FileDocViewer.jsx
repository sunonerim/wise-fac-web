/**
 * pdf , office file viewer
 * office file 의 경우 host name 이 있어야 작한다. 
 */
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Box } from "@mui/material";

export default function FileDocViewer() {
  const docs = [
    {   // uri: "http://175.211.208.151:8080/wisemen/api/v1/pdf/view",
      //  "https://calibre-ebook.com/downloads/demos/demo.docx",
      uri: "http://localhost:3000/free/src/assets/docs/demo.pdf",
        fileType: "pdf",
        fileName:"demo.pdf"  // Local file
     }, // Remote file    ,

    {   uri: "http://175.211.208.151:8080/wisemen/api/v1/docx/view",
      //  "https://calibre-ebook.com/downloads/demos/demo.docx",
      // uri: "http://localhost:3000/free/src/assets/docs/demo.docx",
        fileType: "docx",
        fileName:"demo.docx"  // Local file
     }, // Remote file    ,

    

     {   uri: "https://cse.snu.ac.kr/sites/default/files/node--notice/4.%20%EB%85%BC%EB%AC%B8%EC%9E%91%EC%84%B1%EC%A7%80%EC%B9%A8(%EC%9B%8C%EB%93%9C%EC%96%91%EC%8B%9D).docx",
      //  "https://calibre-ebook.com/downloads/demos/demo.docx",
      // uri: "http://localhost:3000/free/src/assets/docs/demo.docx",
        fileType: "docx",
        fileName:"논문"  // Local file
     } // Remote file    
     
  ];

  const config = {
    header: {
      disableHeader: false, // true로 설정하면 헤더(상단 바)를 숨길 수 있습니다.
      disableFileName: true, // 파일명을 헤더에 표시하지 않도록 설정
      retainURLParams: false, // URL 매개변수를 유지할지 설정
      disableToolbar: false, // 도구 모음을 비활성화할지 설정
    },
    pdfZoom: {      
      defaultZoom: 1.0, // 초기 확대/축소 수준 설정 (기본값은 1.0)
      zoomJump: 0.2, // 확대/축소 단계 설정
    },
    pdfAnnotation: {
      disableAnnotation: false, // 주석 도구를 활성화/비활성화
    },
    toolbar: {
      download: false, // 다운로드 버튼 표시
      zoomIn: true, // 확대 버튼 표시
      zoomOut: true, // 축소 버튼 표시
      rotation: true, // 회전 버튼 표시
      print: true, // 인쇄 버튼 표시
    },
  };

  return(
    <Box sx={{width:1000, height:500, overflow:'auto'}}>
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers} 
        config={config}
      />
    </Box>
  )
   
}