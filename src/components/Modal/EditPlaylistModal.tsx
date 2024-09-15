import React, {useContext, useEffect, useRef, useState} from 'react'
import {Col, Modal, Row} from 'antd';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import {AppContext} from '~/App';
import {useParams} from 'react-router-dom';
import categoryApi from '~/services/categoryApi';
import type { FormInstance } from 'antd/lib';
import {changePlaylistDetails, changePlaylistImage} from '~/services/playlistApi';
import {toast} from 'react-toastify';


const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

const EditPlaylistModal: React.FC=() => {
  const {isModalEditPlaylist, setModalEditPlaylist}=useContext(AppContext);
  const [data, setData]=useState<any>();
  const [file, setFile] = useState<File>();
  const formRef = useRef<FormInstance>();

  const [fileUrl, setFileUrl]=useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const param=useParams();

useEffect(() => {
    const fetchData = async () => {
      const data = await categoryApi({
        type: "playlists",
        id: param?.id,
      });
      setData({ ...data });
    };

    if (param.id !== "undefined") {
      fetchData();
    }
}, [param]);
  
  function handleChange(e: any) {
    if (!e.target.files.length) {
      setFileUrl('');
      setFile(undefined);
      return;
    }
    const url = URL.createObjectURL(e.target.files[0]);
    setFileUrl(url);
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (data) {
      formRef.current?.setFieldsValue({
        name: data?.name,
        description: data?.description,
      });
    }
  }, [data]);

  const onClose=() => {
    setModalEditPlaylist(false)
  }

  return (
    <>
      <Modal
        centered
        width={550}
        open={isModalEditPlaylist}
        footer={null}
        onCancel={() => onClose()}
        title={
          <h1
            style={{
              fontWeight: 700,
              fontSize: '2rem',
              marginBlockStart: 0,
              paddingBlockEnd: 8,
              color: 'white',
            }}
          >
            Edit details
          </h1>
        }
      >
        <ProForm
          formRef={formRef}
          style={{ marginTop: 10 }}
          onFinish={async (values) => {
            try {
              setLoading(true);
              const promise=[changePlaylistDetails(param?.id, values)];
              
              if (file) {
                  const base64File = await toBase64(file);
                  const contentType = file.type;
                  const fileWithoutPrefix = base64File.split(',')[1];
                  promise.push(
                    changePlaylistImage(param!.id, fileWithoutPrefix, contentType)
                  );
              }
  
              await Promise.all(promise);
              toast.success('Playlist updated successfully');
              setLoading(false);

              const data = await categoryApi({
                type: "playlists",
                id: param?.id,
              });
              setData({ ...data });

              setModalEditPlaylist(false)

              return true
            } catch(error) {
              setLoading(false);
              toast.error('Failed to update playlist');
              return false;
            }
          }}
          submitter={{
            render: (props) => (
              <div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    disabled={loading}
                    className='edit-playlist-submit-button'
                    onClick={props.submit || props.onSubmit}
                  >
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ),
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={8} style={{ width: 160, height: 160 }}>
              <div className='playlist-img-container'>
                <div className='playlist-img-overlay'>
                  <div className='playlist-img-overlay-container'>
                    <button aria-haspopup='true'>
                      <div className='icon'>
                        <svg
                          data-encore-id='icon'
                          role='img'
                          height={50}
                          width={50}
                          aria-hidden='true'
                          viewBox='0 0 24 24'
                          style={{ margin: '0 auto' }}
                        >
                          <path d='M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.726 4.726 0 0 1 1.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 0 0 1.001-.636L20.611 5.268a1.329 1.329 0 0 0 0-1.879z'></path>
                        </svg>
                        <span data-encore-id='text'>'Choose photo'</span>
                      </div>
                    </button>
                    <input type='file' onChange={handleChange} accept='image/.jpg, image/.jpeg' />
                  </div>
                </div>
                <img
                  src={
                    fileUrl
                      ? fileUrl
                      : data?.images && data?.images.length
                      ? data?.images[0].url
                      : 'http://localhost:3333/images/imgCoverPlaylist.png'
                  }
                  alt=''
                  className='playlist-img'
                />
              </div>
            </Col>
            <Col span={16}>
              <ProFormText
                placeholder={'Add a name'}
                name={'name'}
                rules={[{ required: true, message: '' }]}
              />
              <ProFormTextArea
                name={'description'}
                placeholder={'Add an optional description'}
                fieldProps={{ autoSize: { minRows: 4 } }}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default EditPlaylistModal