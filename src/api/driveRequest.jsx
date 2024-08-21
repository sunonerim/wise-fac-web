import axios from "axios";
import ErrorDialog from "components/dialogs/ErrorDialog";

const DriveRequest = {
    userId  : 'tiger',
    baseUrl : 'http://localhost:8080/wisemen/api/v1',

    hello : async (seconds) => {
        let url = seconds ? `http://localhost:8080/hello/${seconds}` : 'http://localhost:8080/hello';
        let response = await axios.get( url);
        return response.data;
    },

    getFolderContents: function (folderId) {
        console.log ( '-------------------------  CASE 2')
        const getFolderContentQuery = async ( folderId ) => {
            let urlFolderContentQuery = `http://localhost:8080/wisemen/api/v1/mydrive/folders`;
            if( folderId )
                urlFolderContentQuery =  `http://localhost:8080/wisemen/api/v1/mydrive/folders/${folderId}`
                
            let folderFileList =await axios.get(urlFolderContentQuery, { headers: { 'wm-user-id': DriveRequest.userId} });
            return folderFileList.data;
        };
        return getFolderContentQuery(folderId);        
    },
 
    getFolderPath : async ( folderId ) =>{         
        const self = this;
        let urlFolderContentQuery = `http://localhost:8080/wisemen/api/v1/mydrive/folders/path/${folderId}`;
        let fooldepath = await axios.get( urlFolderContentQuery, { headers:{    'wm-user-id': DriveRequest.userId} })
        return fooldepath.data.reverse();              
    },

    postFolderCreateCommand : async ( parentId, folderName ) => {
        let response = await axios.post('http://localhost:8080/wisemen/api/v1/mydrive/folders', 
        {
            folderName: folderName,
            parentId: parentId,
        }, 
        { 
            headers:{ 
            'Content-type': 'application/json', 
            'Accept': 'application/json' ,
            'wm-user-id': DriveRequest.userId
            } 
        });
        return response;      
    },

    // 폴더 삭제
    deleteFolderCommand : async ( folderId ) => {
        let response = await axios.delete( `${DriveRequest.baseUrl}/mydrive/folders/${folderId}`
        ,{headers:{ 
            'Content-type': 'application/json', 
            'Accept': 'application/json' ,
            'wm-user-id': DriveRequest.userId
            } 
        });
        return response;
    },

    // 파일 생성 ( 업로드   )
    postFileUploadCommand : async ( parentId, files ) => {
        console.log('---------- handleFileUpload', files);
        const formData = new FormData();  
        files.forEach( file => {
            formData.append('multipartFiles', file);
        });
        formData.append('parentId', parentId );
        formData.append('aclId', 200 ); 

        return await axios.post ('http://localhost:8080/wisemen/api/v1/mydrive/folders/files' 
            , formData            
            ,{ headers: { 'wm-user-id': DriveRequest.userId }}
        );
    },

    deleteFileCommand : async ( fileId ) => {
        let response = await axios.delete(`http://localhost:8080/wisemen/api/v1/mydrive/folders/files/${fileId}`
        ,{headers:{ 
            'Content-type': 'application/json', 
            'Accept': 'application/json' ,
            'wm-user-id': DriveRequest.userId
            } 
        });
        return response;
    },

    /**
     * 
     * @param {*} folderId  부모 폴더 아이디( 디렉토리 이동시 사용 )
     * @param {*} itemIdList 이동할 파일 아이디 리스트
     * @returns 
     */
    moveFolderFile : ( folderId, itemIdList ) => {
        console.log('moveFolderFile');
        let response =  axios.put(`http://localhost:8080/wisemen/api/v1/mydrive/move`
            ,{
                parentId : folderId,
                itemIdList : itemIdList
            }
            ,{headers:{ 
                'Content-type': 'application/json', 
                'Accept': 'application/json' ,
                'wm-user-id': DriveRequest.userId
                } 
            });
        return response;
    },

}

export default DriveRequest;