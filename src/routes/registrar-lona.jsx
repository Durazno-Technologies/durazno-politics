import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Select from 'react-select';
import ClipLoader from 'react-spinners/ClipLoader';
import { getMunicipalities, getDistricts, existsPhoneNumber } from '../services/api';
import { ToastContainer } from 'react-toastify';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css';

const RegistrarLona = () => {
  const { authStatus, user } = useAuthenticator((context) => [context.authStatus]);
  const { route } = useAuthenticator((context) => [context.route]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumberError, setPhoneError] = useState('');
  const [municipalities, setMunicipalities] = useState('');
  const [municipalityDistricts, setMunicipalityDistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState({});
  const [hasErrors, setHasErrors] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    const { fields } = { fields: data };

    const requestObject = {
      method: 'POST',
      body: {
        fileName: fields.inePicture[0].name,
        fileType: fields.inePicture[0].type,
      },
    };

    console.log(requestObject);

    /*fetch(
      'https://a3lreatcgbh5ugbmcy7mozqd440utiqy.lambda-url.us-east-2.on.aws/',
      requestObject,
    ).then((res) => {
      console.log(res);
      fetch(res.signedUrl, {
        method: 'PUT',
        body: fields.inePicture[0],
      }).then((res) => {
        console.log(res);
      });
    });*/

    /*let led = {
      municipality: fields.municipality.label,
      district: selectedDistrict.districtNumber,
      section: selectedSection.value,
      address: fields.location.label.toUpperCase(),
      phoneNumber: fields.phoneNumber.slice(3),
      ine: fields.electorIdentifier,
    };

    let ledCreated = await createUser(led);
    if (ledCreated) {
      toast.success('Lona agregada correctamente!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      reset({
        municipality: municipalities[0],
        district: districts[0],
        section: sections[0],
        phoneNumber: '',
        location: '',
        electorIdentifier: '',
      });
      setAncestorName('');
      setIsLoading(false);
    } else {
      toast.error('Hubo un error agregando la lona, favor de intentar más tarde', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });*/
    setIsLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    const getMunicipalitiesData = async () => {
      let municipalities = await getMunicipalities();
      if (!municipalities) {
        console.log(municipalities);
        setHasErrors(true);
      } else {
        if (!ignore) {
          municipalities = municipalities
            .map((municipality) => ({
              ...municipality,
              label: municipality.name,
              value: municipality.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setMunicipalities(municipalities);
          //setSelectedMunicipality(municipalities[0]);
          await getDistrictsData(municipalities[0]);
        }
      }

      setIsLoading(false);
    };

    const getDistrictsData = async (municipality) => {
      let districtsData = await getDistricts();
      if (!districtsData) {
        setHasErrors(true);
      } else {
        if (!ignore) {
          districtsData = districtsData.map((district) => ({
            ...district,
            label: district.districtNumber,
            value: district.districtNumber,
          }));

          setDistricts(districtsData);
          let municipalityDistrictsData = districtsData.filter(
            (district) => municipality.districtIds.indexOf(district.id) >= 0,
          );
          setMunicipalityDistricts(municipalityDistrictsData);
          setSelectedDistrict(municipalityDistrictsData[0]);
          let sectionsData = municipalityDistrictsData[0].sections.map((section) => ({
            label: section,
            value: section,
          }));
          setSections(sectionsData);
          setSelectedSection(sectionsData[0]);
        }
      }
    };

    if (authStatus === 'authenticated') {
      setIsLoading(true);
      getMunicipalitiesData();
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === 'configuring' && route === 'setup') {
      navigate('/');
    }
  }, [authStatus, route]);

  const isAvailable = async (phoneNumber) => {
    if (isValidPhoneNumber(phoneNumber)) {
      const existsPhone = await existsPhoneNumber(phoneNumber.slice(3));
      if (existsPhone) {
        setPhoneError('Este número ya ha sido ocupado para un registro');
        return false;
      } else {
        return true;
      }
    } else {
      setPhoneError('Favor de ingresar un número valido');
      return false;
    }
  };

  const isValidElectorIdentifier = (electorIdentifier) => {
    if (electorIdentifier.length !== 18) {
      return false;
    } else {
      electorIdentifier = electorIdentifier.toUpperCase();
      const regex = /\b[A-Z]{6}[0-9]{8}[A-Z]{1}[0-9]{3}/;
      return regex.test(electorIdentifier);
    }
  };

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader color={'#96272d'} size={50} aria-label='Loading Spinner' data-testid='loader' />
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className='h-screen flex justify-center'>
        <p className='mt-12 text-pink-800 text-bold'>
          Tenemos errores comunicándonos con el servidor 😐 , favor de intentar más tarde
        </p>
      </div>
    );
  }

  if (authStatus === 'configuring') {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader color={'#96272d'} size={50} aria-label='Loading Spinner' data-testid='loader' />
      </div>
    );
  }

  return (
    <>
      {authStatus !== 'authenticated' || user.attributes['custom:role'] === 'Dirigente' ? (
        <Navigate to='/' />
      ) : (
        <>
          <div className='container mt-8 mb-8 pb-8 bg-white rounded-md  pt-6 h-auto'>
            <Header />

            <ToastContainer />
            <h1 className='mt-8 text-orange-900 font-extrabold text-3xl text-center'>
              #VamosConDelfina
            </h1>
            <h3 className='text-red-800	font-extrabold text-xl text-center mt-2'>Registro</h3>
            <form
              className=' container max-w-xl mt-4 py-10 mt-10 px-4 border'
              onSubmit={handleSubmit(onSubmit)}
            >
              {municipalities.length > 0 && (
                <>
                  <label className='text-gray-600 font-medium'>
                    Municipio <span className='text-red-600'>*</span>
                  </label>
                  <Controller
                    name='municipality'
                    control={control}
                    rules={{ required: true }}
                    defaultValue={municipalities[0]}
                    render={({ field }) => {
                      return (
                        <Select
                          options={municipalities}
                          onChange={(val) => {
                            let newDistrictsMunicipality = districts
                              .filter((district) => val.districtIds.indexOf(district.id) >= 0)
                              .sort((a, b) => a.districtNumber - b.districtNumber);

                            setMunicipalityDistricts(newDistrictsMunicipality);
                            setSelectedDistrict(newDistrictsMunicipality[0]);
                            let newSections = newDistrictsMunicipality[0].sections.map(
                              (section) => ({
                                label: section,
                                value: section,
                              }),
                            );
                            setSections(newSections);
                            setSelectedSection(newSections[0]);
                            field.onChange(val);
                          }}
                          isSearchable={true}
                          value={municipalities.find((c) => c.value === field.value.value)}
                          autoFocus={true}
                        />
                      );
                    }}
                  />
                  {errors.municipality && (
                    <div className='mb-3 text-normal text-red-500'>
                      Favor de seleccionar un municipio
                    </div>
                  )}
                </>
              )}

              {municipalityDistricts.length > 0 && (
                <div className='mt-4'>
                  <label className='text-gray-600 font-medium'>
                    Distrito <span className='text-red-600'>*</span>
                  </label>
                  <Controller
                    name='district'
                    control={control}
                    defaultValue={municipalityDistricts[0]}
                    render={({ field }) => {
                      return (
                        <Select
                          options={municipalityDistricts}
                          onChange={(val) => {
                            let newDistrict = districts.filter(
                              (district) => district.id === val.id,
                            )[0];
                            setSelectedDistrict(newDistrict);
                            let newSections = newDistrict.sections.map((section) => ({
                              label: section,
                              value: section,
                            }));
                            setSections(newSections);
                            setSelectedSection(newSections[0]);
                            field.onChange(val);
                          }}
                          isSearchable={true}
                          value={selectedDistrict}
                        />
                      );
                    }}
                  />
                </div>
              )}

              {sections.length > 0 && (
                <div className='mt-4'>
                  <label className='text-gray-600 font-medium'>
                    Sección <span className='text-red-600'>*</span>
                  </label>
                  <Controller
                    name='section'
                    control={control}
                    defaultValue={sections[0]}
                    render={({ field }) => (
                      <Select
                        options={sections}
                        onChange={(val) => {
                          setSelectedSection(
                            sections.filter((section) => section.value === val.value)[0],
                          );
                          field.onChange(val);
                        }}
                        isSearchable={true}
                        value={selectedSection}
                      />
                    )}
                  />
                </div>
              )}

              <div className='mt-4'>
                <label htmlFor='phoneNumber' className='text-gray-600 font-medium'>
                  Teléfono <span className='text-red-600'>*</span>
                </label>
                <Controller
                  name='phoneNumber'
                  control={control}
                  rules={{
                    validate: (value) => isAvailable(value),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      country='MX'
                      id='phoneNumber'
                      className='border-solid border-gray-300 border p-2  w-full rounded text-gray-700'
                    />
                  )}
                />
                {errors['phoneNumber'] && (
                  <div className='mb-3 text-normal text-red-500'>{phoneNumberError}</div>
                )}
              </div>

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Dirección <span className='text-red-600'>*</span>
                </label>
                <Controller
                  name='location'
                  rules={{ required: true }}
                  control={control}
                  placeh
                  render={({ field, fieldState }) => (
                    <GooglePlacesAutocomplete
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      error={fieldState.error}
                      selectProps={{
                        ...field,
                        isClearable: true,
                        placeholder: 'Ingresa una dirección',
                      }}
                      apiOptions={{ language: 'es', region: 'mx' }}
                    />
                  )}
                />
              </div>
              {errors.location && (
                <div className='mb-3 text-normal text-red-500'>Favor de ingresar una dirección</div>
              )}

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Clave de Elector <span className='text-red-600'>*</span>
                </label>
                <input
                  className='border-solid border-gray-300 border p-2  w-full rounded text-gray-700'
                  name='electorIdentifier'
                  {...register('electorIdentifier', {
                    required: true,
                    validate: isValidElectorIdentifier,
                  })}
                />
                {errors?.electorIdentifier?.type === 'required' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar una clave de elector
                  </div>
                )}
                {errors?.electorIdentifier?.type === 'validate' && (
                  <div className='mb-3 text-normal text-red-500'>
                    Favor de ingresar una clave de elector valida
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Foto INE <span className='text-red-600'>*</span>
                </label>
                <input
                  {...register('inePicture', {
                    required: true,
                    validate: {
                      lessThan10MB: (files) =>
                        files[0]?.size < 10000000 ||
                        'Tamaño máximo permitido por imagen es de 10 MB',
                      acceptedFormats: (files) =>
                        ['image/jpeg', 'image/png'].includes(files[0]?.type) ||
                        'Solamente puedes subir imágenes en formato PNG o JPEG',
                    },
                  })}
                  type='file'
                />
              </div>
              {errors?.inePicture?.type === 'required' && (
                <div className='mb-3 text-normal text-red-500'>Favor de seleccionar una imagen</div>
              )}

              {errors.inePicture && (
                <div className='mb-3 text-normal text-red-500'>{errors.inePicture.message}</div>
              )}

              <div className='mt-4'>
                <label className='text-gray-600 font-medium'>
                  Foto Lona<span className='text-red-600'>*</span>
                </label>
                <input
                  {...register('lonaPicture', {
                    required: true,
                    validate: {
                      lessThan10MB: (files) =>
                        files[0]?.size < 10000000 ||
                        'Tamaño máximo permitido por imagen es de 10 MB',
                      acceptedFormats: (files) =>
                        ['image/jpeg', 'image/png'].includes(files[0]?.type) ||
                        'Solamente puedes subir imágenes en formato PNG o JPEG',
                    },
                  })}
                  type='file'
                />
              </div>
              {errors?.lonaPicture?.type === 'required' && (
                <div className='mb-3 text-normal text-red-500'>Favor de seleccionar una imagen</div>
              )}

              {errors.lonaPicture && (
                <div className='mb-3 text-normal text-red-500'>{errors.lonaPicture.message}</div>
              )}

              <button
                className={
                  isLoading
                    ? 'mt-8 w-full bg-slate-400 hover:bg-slate-600 text-white-100 border py-3 px-6 font-semibold text-md rounded'
                    : 'mt-8 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded'
                }
                type='submit'
                disabled={isLoading}
              >
                Enviar
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default RegistrarLona;
