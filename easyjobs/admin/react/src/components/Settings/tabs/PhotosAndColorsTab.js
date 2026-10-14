import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../util/imageCrop';
import { toast } from 'react-toastify';
const PhotosAndColorsTab = ({
  currentTab,
  loading,
  getPhotosAndColors,
  uploadCompanyImage,
  photosAndColors,
  updateBrandColor,
  updateShowLife,
  uploadedImg,
  removeImages,
  updateShowCoverPhoto,
  reset,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [target, setTarget] = useState('');
  const [imageToCrop, setImageToCrop] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState({ width: 250, height: 250 });
  const [ratio, setRatio] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [colorChoice, setColorChoice] = useState('');
  const [formData, setFormData] = useState({
    brand_color: '',
    show_life: false,
    show_cover_photo: false,
  });
  const [images, setImages] = useState({
    company_logo: '',
    company_favicon: '',
    cover_photo: '',
    showcase_photo_1: '',
    showcase_photo_2: '',
    showcase_photo_3: '',
    showcase_photo_4: '',
    showcase_photo_5: '',
  });
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });
  const [photoRemoveData, setPhotoRemoveData] = useState({});
  const [photoRemoveMessage, setPhotoRemoveMessage] = useState('');
  const [imageToChange, setImageToChange] = useState('');
  const colors = ['#597dfc', '#60ce83', '#ff5f74', '#2fc1e1', '#ff9635'];
  const companyImages = [
    {
      name: 'company_logo',
      cropSize: { width: 400, height: 400 },
      ratio: 1,
      fileName: 'logo',
    },
    {
      name: 'company_favicon',
      cropSize: { width: 150, height: 150 },
      ratio: 1,
      fileName: 'company_favicon',
    },
    {
      name: 'cover_photo',
      cropSize: { width: 600, height: 315 },
      ratio: 40 / 21,
      fileName: 'cover_photo',
    },
    {
      name: 'showcase_photo',
      cropSize: { width: 480, height: 350 },
      ratio: 48 / 35,
      fileName: 'showcase_photo',
    },
  ];
  const logoRef = useRef();
  const faviconRef = useRef();
  const coverPhotoRef = useRef();
  const sPhoto1Ref = useRef();
  const sPhoto2Ref = useRef();
  const sPhoto3Ref = useRef();
  const sPhoto4Ref = useRef();
  const sPhoto5Ref = useRef();

  useEffect(() => {
    getPhotosAndColors();
  }, [uploadedImg]);

  useEffect(() => {
    if (photosAndColors) {
      setImages({
        company_logo: photosAndColors.logo,
        company_favicon: photosAndColors.company_favicon,
        cover_photo: photosAndColors.cover_photo,
        showcase_photo_1: photosAndColors.showcase_photos_1,
        showcase_photo_2: photosAndColors.showcase_photos_2,
        showcase_photo_3: photosAndColors.showcase_photos_3,
        showcase_photo_4: photosAndColors.showcase_photos_4,
        showcase_photo_5: photosAndColors.showcase_photos_5,
      });
      setFormData({
        brand_color: photosAndColors.brand_color,
        show_life: photosAndColors.show_life,
        show_cover_photo: photosAndColors?.remove_cover_photo,
      });
    }
  }, [photosAndColors]);

  useEffect(() => {
    if (photosAndColors) {
      if (formData.brand_color !== photosAndColors.brand_color) {
        updateBrandColor(formData.brand_color);
      }
    }
  }, [formData.brand_color]);

  useEffect(() => {
    if (uploadedImg) {
      uploadedImg = uploadedImg.toString();
      if (uploadedImg === 'company_logo') {
        toast.success('Company logo changed.');
      }
      if (uploadedImg === 'company_favicon') {
        toast.success('Company favicon changed.');
      }
      if (uploadedImg === 'cover_photo') {
        toast.success('Cover photo changed.');
      }
      if (uploadedImg.includes('showcase_photo')) {
        toast.success('Showcase photo changed.');
      }
      setImages({ ...images, [uploadedImg]: imageToChange });
      setImageToChange('');
    }
  }, [uploadedImg]);

  const onCropComplete = (croppedArea, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels);

  const uploadImage = (e, name) => {
    const file = e.target.files[0];
    let imagePropertyName = name;
    if (file) {
      if (name.includes('showcase_photo')) {
        imagePropertyName = 'showcase_photo';
      }
      const url = URL.createObjectURL(file);
      const [imageProperty] = companyImages.filter(
        (image) => image.name === imagePropertyName,
      );

      setImageToCrop(url);
      setCropSize(imageProperty.cropSize);
      setRatio(imageProperty.ratio);
      setShowModal(true);
      setTarget(name);
    }
  };
  const saveCropAndUpload = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        0,
        'blob',
      );
      if (croppedImage) {
        setImageToChange(URL.createObjectURL(croppedImage));
        uploadCompanyImage(croppedImage, target);
        setShowModal(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    } catch (e) {
      toast.error(e);
    }
  }, [croppedAreaPixels]);

  const handleRemoveImages = (e) => {
    e.preventDefault();
    removeImages(photoRemoveData);
    setRemoveModalShowHide({ display: 'none' });
    setPhotoRemoveData({});
    setPhotoRemoveMessage('');
  };

  const handleRemovePhotoInit = (e, data, message) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'block' });
    setPhotoRemoveData(data);
    setPhotoRemoveMessage(message);
  };

  const handleCancelRemovePhoto = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
    setPhotoRemoveData({});
    setPhotoRemoveMessage('');
  };

  return (
    <div className={`settings-tab active ${loading ? 'ej-loading' : ''}`}>
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">Photos and Colors</div>
      </div>
      <div className="form-box">
        <div className="image-selector form-group">
          <div className="company-logo">
            <label>Company Logo*</label>
            <div className="selection-box">
              <div className="img-box position-relative">
                {images.company_logo && (
                  <>
                    <img src={images.company_logo} alt="Change Logo" />
                    {photosAndColors?.hasLogo && (
                      <span
                        className="del-btn"
                        onClick={(e) =>
                          handleRemovePhotoInit(
                            e,
                            {
                              _method: 'DELETE',
                              target: 'company_logo',
                              order: null,
                            },
                            'Are you sure you want to remove company logo?',
                          )
                        }
                      >
                        <i className="easyjobs-icon easyjobs-delete"></i>
                      </span>
                    )}
                  </>
                )}
              </div>
              <label className="file-browse-button">
                <span>Change Logo</span>
                <input
                  type="file"
                  onChange={(e) => uploadImage(e, 'company_logo')}
                  ref={logoRef}
                  onClick={(e) => (logoRef.current.value = '')}
                />
              </label>
            </div>
          </div>
          <div className="company-favicon">
            <label>Company Favicon*</label>
            <div className="selection-box">
              <div className="img-box position-relative">
                {images.company_favicon && (
                  <>
                    <img src={images.company_favicon} alt="Change favicon" />
                    {photosAndColors?.hasFavicon && (
                      <span
                        className="del-btn"
                        onClick={(e) =>
                          handleRemovePhotoInit(
                            e,
                            {
                              _method: 'DELETE',
                              target: 'company_favicon',
                              order: null,
                            },
                            'Are you sure you want to remove company favicon?',
                          )
                        }
                      >
                        <i className="easyjobs-icon easyjobs-delete"></i>
                      </span>
                    )}
                  </>
                )}
              </div>
              <label className="file-browse-button">
                <span>Change Favicon</span>
                <input
                  type="file"
                  onChange={(e) => uploadImage(e, 'company_favicon')}
                  ref={faviconRef}
                  onClick={(e) => (faviconRef.current.value = '')}
                />
              </label>
            </div>
          </div>
          <div className="company-brand_color">
            <label>Brand Color</label>
            <div className="selection-box">
              {colors.map((each, i) => {
                const borderColor = each === formData.brand_color ? each : '';
                return (
                  <label
                    className="brand--color"
                    style={{ borderColor: borderColor }}
                    key={`b-c-${i}`}
                  >
                    <input
                      id={`b-c-${i}`}
                      name="brand-color"
                      type="radio"
                      value={each}
                      onChange={(e) => {
                        setColorChoice(e.target.value);
                        setConfirmation(true);
                        setRemoveModalShowHide({ display: 'block' });
                        // setPhotoRemoveData(data);
                        setPhotoRemoveMessage(
                          'Are you sure you want to set this brand color?',
                        );
                      }}
                    />
                    <span
                      htmlFor={`b-c-${i}`}
                      style={{ background: each }}
                    ></span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className="banner-upload mt-30"
        style={{ backgroundImage: `url(${images.cover_photo})` }}
      >
        <label className="file-browse-button semi-button primary-button">
          <span>Change Cover Photo</span>
          <input
            type="file"
            onChange={(e) => uploadImage(e, 'cover_photo')}
            ref={coverPhotoRef}
            onClick={(e) => (coverPhotoRef.current.value = '')}
          />
        </label>
        <div className="ej-switch">
          <input
            type="checkbox"
            id="ai-enabled"
            className="notify"
            name="is_ai_enabled"
            checked={!formData?.show_cover_photo}
            onChange={(e) => {
              setFormData({ ...formData, show_cover_photo: !e.target.checked });
              updateShowCoverPhoto(!e.target.checked);
            }}
          />
          <label htmlFor="ai-enabled" className="switch__btn">
            <span>{!formData?.show_cover_photo ? 'Show' : 'Hide'}</span>
          </label>
        </div>
        {photosAndColors?.hasCoverPhoto && (
          <span
            className="del-btn"
            onClick={(e) =>
              handleRemovePhotoInit(
                e,
                { _method: 'DELETE', target: 'cover_photo', order: null },
                'Are you sure you want to remove cover photo?',
              )
            }
          >
            <i className="easyjobs-icon easyjobs-delete"></i>
          </span>
        )}
      </div>
      <div className="form-box mt-30 feature-image-box">
        <div className="d-flex justify-content-between">
          <div className="section-title">Life at WPDeveloper</div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={formData.show_life}
              onChange={(e) => {
                setFormData({ ...formData, show_life: e.target.checked });
                updateShowLife(e.target.checked);
              }}
            />
            <span>Show on Company Page</span>
          </label>
        </div>
        <div className="form-group">
          <label>Upload Images to showcase your team & company.</label>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div
              className="feature-image feature-image-lg"
              style={{ backgroundImage: `url(${images.showcase_photo_1})` }}
            >
              <label className="file-browse-button semi-button primary-button">
                <span>Change Photo</span>
                <input
                  type="file"
                  onChange={(e) => uploadImage(e, 'showcase_photo_1')}
                  ref={sPhoto1Ref}
                  onClick={(e) => (sPhoto1Ref.current.value = '')}
                />
              </label>
              {photosAndColors?.hasShowcasePhoto[1] && (
                <span
                  className="del-btn"
                  onClick={(e) =>
                    handleRemovePhotoInit(
                      e,
                      { _method: 'DELETE', target: 'showcase_photo', order: 1 },
                      'Are you sure you want to remove showcase photo?',
                    )
                  }
                >
                  <i className="easyjobs-icon easyjobs-delete"></i>
                </span>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6">
                <div
                  className="feature-image feature-image-md"
                  style={{ backgroundImage: `url(${images.showcase_photo_2})` }}
                >
                  <label className="file-browse-button semi-button primary-button">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e, 'showcase_photo_2')}
                      ref={sPhoto2Ref}
                      onClick={(e) => (sPhoto2Ref.current.value = '')}
                    />
                  </label>
                  {photosAndColors?.hasShowcasePhoto[2] && (
                    <span
                      className="del-btn"
                      onClick={(e) =>
                        handleRemovePhotoInit(
                          e,
                          {
                            _method: 'DELETE',
                            target: 'showcase_photo',
                            order: 2,
                          },
                          'Are you sure you want to remove showcase photo?',
                        )
                      }
                    >
                      <i className="easyjobs-icon easyjobs-delete"></i>
                    </span>
                  )}
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="feature-image feature-image-md"
                  style={{ backgroundImage: `url(${images.showcase_photo_3})` }}
                >
                  <label className="file-browse-button semi-button primary-button">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e, 'showcase_photo_3')}
                      ref={sPhoto3Ref}
                      onClick={(e) => (sPhoto3Ref.current.value = '')}
                    />
                  </label>
                  {photosAndColors?.hasShowcasePhoto[3] && (
                    <span
                      className="del-btn"
                      onClick={(e) =>
                        handleRemovePhotoInit(
                          e,
                          {
                            _method: 'DELETE',
                            target: 'showcase_photo',
                            order: 3,
                          },
                          'Are you sure you want to remove showcase photo?',
                        )
                      }
                    >
                      <i className="easyjobs-icon easyjobs-delete"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-30">
              <div className="col-sm-6">
                <div
                  className="feature-image feature-image-md"
                  style={{ backgroundImage: `url(${images.showcase_photo_4})` }}
                >
                  <label className="file-browse-button semi-button primary-button">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e, 'showcase_photo_4')}
                      ref={sPhoto4Ref}
                      onClick={(e) => (sPhoto4Ref.current.value = '')}
                    />
                  </label>
                  {photosAndColors?.hasShowcasePhoto[4] && (
                    <span
                      className="del-btn"
                      onClick={(e) =>
                        handleRemovePhotoInit(
                          e,
                          {
                            _method: 'DELETE',
                            target: 'showcase_photo',
                            order: 4,
                          },
                          'Are you sure you want to remove showcase photo?',
                        )
                      }
                    >
                      <i className="easyjobs-icon easyjobs-delete"></i>
                    </span>
                  )}
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="feature-image feature-image-md"
                  style={{ backgroundImage: `url(${images.showcase_photo_5})` }}
                >
                  <label className="file-browse-button semi-button primary-button">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e, 'showcase_photo_5')}
                      ref={sPhoto5Ref}
                      onClick={(e) => (sPhoto5Ref.current.value = '')}
                    />
                  </label>
                  {photosAndColors?.hasShowcasePhoto[5] && (
                    <span
                      className="del-btn"
                      onClick={(e) =>
                        handleRemovePhotoInit(
                          e,
                          {
                            _method: 'DELETE',
                            target: 'showcase_photo',
                            order: 5,
                          },
                          'Are you sure you want to remove showcase photo?',
                        )
                      }
                    >
                      <i className="easyjobs-icon easyjobs-delete"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal resize-image-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crop image</h5>
                <button
                  type="button"
                  className="close"
                  onClick={(e) => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="cropper-container">
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    aspect={ratio}
                    onZoomChange={setZoom}
                    cropSize={cropSize}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={(e) => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={saveCropAndUpload}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmation && (
        <div
          className="dg-wrapper ej-candidate-confirmation"
          id="ej-candidate-confirmation"
          style={removeModalShowHide}
        >
          <div className="dg-backdrop"></div>
          <div className="dg-container">
            <div className="dg-content-cont dg-content-cont--floating">
              <div className="dg-main-content">
                <div className="dg-view-wrapper">
                  <div className="dg-content-body dg-content-body--has-title">
                    <h6 className="dg-title">Confirmation</h6>
                    <div className="dg-content">
                      {photoRemoveMessage && photoRemoveMessage}
                    </div>
                  </div>
                  <div className="dg-content-footer">
                    <button
                      className="dg-btn dg-btn--cancel remove-rating-cancel"
                      onClick={handleCancelRemovePhoto}
                    >
                      <span>No</span>
                    </button>
                    <button
                      className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData({ ...formData, brand_color: colorChoice });
                        setConfirmation(false);
                        setRemoveModalShowHide({ display: 'none' });
                      }}
                    >
                      <span className="dg-btn-content">Yes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!confirmation && (
        <div
          className="dg-wrapper ej-candidate-confirmation"
          id="ej-candidate-confirmation"
          style={removeModalShowHide}
        >
          <div className="dg-backdrop"></div>
          <div className="dg-container">
            <div className="dg-content-cont dg-content-cont--floating">
              <div className="dg-main-content">
                <div className="dg-view-wrapper">
                  <div className="dg-content-body dg-content-body--has-title">
                    <h6 className="dg-title">Confirmation</h6>
                    <div className="dg-content">
                      {photoRemoveMessage && photoRemoveMessage}
                    </div>
                  </div>
                  <div className="dg-content-footer">
                    <button
                      className="dg-btn dg-btn--cancel remove-rating-cancel"
                      onClick={handleCancelRemovePhoto}
                    >
                      <span>No</span>
                    </button>
                    <button
                      className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                      onClick={handleRemoveImages}
                    >
                      <span className="dg-btn-content">Yes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosAndColorsTab;
