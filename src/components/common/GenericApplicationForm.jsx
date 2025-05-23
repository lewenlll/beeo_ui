import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Chip,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

// Helper function to render values (can be moved to a common util if used elsewhere)
const renderValue = (value, placeholder = 'N/A') => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || typeof value === 'undefined' || value === '') {
        return <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{placeholder}</Typography>;
    }
    return value;
};

// Helper function to render address (can be moved to a common util)
const renderAddress = (address) => {
    if (!address) return <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N/A</Typography>;
    const addressParts = [
        address.flat,
        address.floor,
        address.block,
        address.building,
        address.street,
        address.city,
        address.streetNo,
        address.streetEnglish || address.streetChinese,
        address.districtEnglish || address.districtChinese,
    ].filter(part => part && String(part).trim() !== '');

    if (addressParts.length === 0) return <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N/A</Typography>;

    let formattedAddress = '';
    if (address.streetNo && (address.streetEnglish || address.streetChinese)) { // COCR S1 style
        formattedAddress = `${address.streetNo} ${address.streetEnglish || address.streetChinese}, ${address.districtEnglish || address.districtChinese}`;
    } else { // REA style
        const mainAddress = [address.flat, address.floor, address.block, address.building].filter(Boolean).join(' ');
        const streetCity = [address.street, address.city].filter(Boolean).join(', ');
        if (mainAddress && streetCity) {
            formattedAddress = `${mainAddress}, ${streetCity}`;
        } else {
            formattedAddress = mainAddress || streetCity;
        }
    }
    return formattedAddress.replace(/\s+/g, ' ').trim() || <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N/A</Typography>;
};

// Common TextField props for edit mode
const commonTextFieldProps = (value, onChangeHandler, InputPropsOverrides = {}, sxOverrides = {}) => ({
    fullWidth: true,
    value: value || '',
    onChange: onChangeHandler,
    size: "small",
    margin: "dense",
    InputProps: { style: { fontSize: '0.875rem' }, ...InputPropsOverrides },
    sx: { mt: 0, bgcolor: 'white', borderRadius: 1, ...sxOverrides }
});

// Common Typography props for display mode
const commonDisplayTypographyProps = {
    variant: "body2",
    sx: { bgcolor: 'grey.50', p: 0.75, borderRadius: 1, minHeight: '38px', display: 'flex', alignItems: 'center', width: '100%' }
};

// Generic FormItem
const FormItem = ({ label, value, editValue, onChange, editMode, sm = 6, md = 4, lg = 3, children, required = false, labelSx = {} }) => (
    <Grid item xs={12} sm={sm} md={md} lg={lg}>
        <Typography variant="caption" color="textSecondary" display="block" fontWeight="bold" sx={{ fontSize: '0.7rem', mb: 0.25, ...labelSx }}>
            {label} {required && editMode && <span style={{ color: 'red' }}>*</span>}
        </Typography>
        {editMode ? (
            children ? children : <TextField {...commonTextFieldProps(editValue, onChange)} />
        ) : (
            children ? children : <Typography {...commonDisplayTypographyProps}>{renderValue(value)}</Typography>
        )}
    </Grid>
);


const GenericApplicationForm = (props) => {
    const {
        applicationType, // To determine which form structure to render
        applicationData, // Data for display mode (original data)
        editableData,    // Data for edit mode (form state)
        editMode,
        // Field change handlers (expected to be compatible with WBRSApplicationTabs structure)
        handleFieldChange, // Top-level field
        handleSimpleFieldChange, // For nested objects like applicantInfo.position
        handleNestedFieldChange, // For deeply nested objects like applicantInfo.currentCompany.name or applicantInfo.contact.officePhone
        handleAddressChange, // For address blocks e.g. applicantInfo.currentCompany.address.flat
        handleArrayObjectChange, // For items in an array e.g. qualifications[index].membershipNo
        handleQualificationAttachmentChange, // Specific for qualification attachments
        // Any other specific handlers needed for REA form
    } = props;

    if (!editableData || !applicationData) {
        return <Typography sx={{ p: 2 }}>Application data is not available.</Typography>;
    }

    // Render REA Registration Form
    if (applicationType === 'REA Registration') {
        return (
            <Box>
                {/* Applicant Information Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Applicant Information" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            <FormItem label="Application Type" editMode={editMode} md={3}
                                value={applicationData.applicationType}
                                editValue={editableData.applicationType}
                                onChange={(e) => handleFieldChange('applicationType', e.target.value)}
                            />
                            <FormItem label="Company Name" editMode={editMode} md={3}
                                value={applicationData.applicantInfo?.currentCompany?.name}
                                editValue={editableData.applicantInfo?.currentCompany?.name}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'currentCompany', 'name', e.target.value)}
                            />
                            <FormItem label="Position" editMode={editMode} md={3}
                                value={applicationData.applicantInfo?.position}
                                editValue={editableData.applicantInfo?.position}
                                onChange={(e) => handleSimpleFieldChange('applicantInfo', 'position', e.target.value)}
                            />
                            <FormItem label="Office Phone" editMode={editMode} md={3}
                                value={applicationData.applicantInfo?.contact?.officePhone}
                                editValue={editableData.applicantInfo?.contact?.officePhone}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', 'officePhone', e.target.value)}
                            />
                            <FormItem label="Fax" editMode={editMode} md={3}
                                value={applicationData.applicantInfo?.contact?.fax}
                                editValue={editableData.applicantInfo?.contact?.fax}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', 'fax', e.target.value)}
                            />
                            <Grid item xs={12} >
                                <Typography variant="caption" color="textSecondary" display="block" fontWeight="bold" sx={{ fontSize: '0.7rem', mb: 0.5 }}>Address</Typography>
                                {editMode ? (
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} sm={2}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.flat, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'flat', e.target.value))} label="Flat" /></Grid>
                                        <Grid item xs={6} sm={2}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.floor, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'floor', e.target.value))} label="Floor" /></Grid>
                                        <Grid item xs={6} sm={2}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.block, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'block', e.target.value))} label="Block" /></Grid>
                                        <Grid item xs={6} sm={6}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.building, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'building', e.target.value))} label="Building" /></Grid>
                                        <Grid item xs={12} sm={6}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.street, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'street', e.target.value))} label="Street" /></Grid>
                                        <Grid item xs={12} sm={6}><TextField {...commonTextFieldProps(editableData.applicantInfo?.currentCompany?.address?.city, (e) => handleAddressChange('applicantInfo', 'currentCompany', 'city', e.target.value))} label="City/District" /></Grid>
                                    </Grid>
                                ) : (
                                    <Typography {...commonDisplayTypographyProps}>{renderAddress(applicationData.applicantInfo?.currentCompany?.address)}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Practical Experience Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Practical Experience" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        {editableData.practicalExperience?.map((exp, index) => (
                            <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', p: 1.5, mb: 1.5, '&:last-child': { mb: 0 } }}>
                                <Grid container spacing={1.5}>
                                    <FormItem label="Start Date" editMode={editMode} md={3}
                                        value={applicationData.practicalExperience?.[index]?.startDate ? new Date(applicationData.practicalExperience[index].startDate).toLocaleDateString() : null}
                                    >
                                        {editMode && <TextField {...commonTextFieldProps(exp.startDate, (e) => handleArrayObjectChange('practicalExperience', index, 'startDate', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                                    </FormItem>
                                    <FormItem label="End Date" editMode={editMode} md={3}
                                        value={applicationData.practicalExperience?.[index]?.endDate ? new Date(applicationData.practicalExperience[index].endDate).toLocaleDateString() : null}
                                    >
                                        {editMode && <TextField {...commonTextFieldProps(exp.endDate, (e) => handleArrayObjectChange('practicalExperience', index, 'endDate', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                                    </FormItem>
                                    <FormItem label="Position" editMode={editMode} md={3}
                                        value={applicationData.practicalExperience?.[index]?.position}
                                        editValue={exp.position}
                                        onChange={(e) => handleArrayObjectChange('practicalExperience', index, 'position', e.target.value)}
                                    />
                                    <FormItem label="Company" editMode={editMode} md={3}
                                        value={applicationData.practicalExperience?.[index]?.company}
                                        editValue={exp.company}
                                        onChange={(e) => handleArrayObjectChange('practicalExperience', index, 'company', e.target.value)}
                                    />
                                    <FormItem label="Description" editMode={editMode}
                                        xs={12} sm={8} md={8} lg={8}
                                        value={applicationData.practicalExperience?.[index]?.description}
                                    >
                                        {editMode && <TextField {...commonTextFieldProps(exp.description, (e) => handleArrayObjectChange('practicalExperience', index, 'description', e.target.value))} multiline rows={2} />}
                                    </FormItem>
                                    <FormItem label="Supporting Document" editMode={editMode}
                                        xs={12} sm={4} md={4} lg={4}
                                        value={applicationData.practicalExperience?.[index]?.attachment?.fileName}
                                    >
                                        {editMode ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', bgcolor:'grey.100', p:0.75, borderRadius:1, minHeight:'38px', display:'flex', alignItems:'center' }}>
                                                    {exp.attachment?.fileName || 'No file selected'}
                                                    {exp.attachment?.fileName && exp.attachment?.fileSize && <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>({exp.attachment.fileSize})</Typography>}
                                                </Typography>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    onClick={() => {
                                                        const newFileName = window.prompt('Enter new file name:', exp.attachment?.fileName);
                                                        if (newFileName) {
                                                            const newFileSize = `${(Math.random() * 2 + 0.5).toFixed(1)}MB`; // Mock file size
                                                            handleArrayObjectChange('practicalExperience', index, 'attachment', { fileName: newFileName, fileSize: newFileSize });
                                                        }
                                                    }}
                                                    sx={{ height:'38px', flexShrink:0, fontSize:'0.7rem'}}
                                                >
                                                    Replace
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '38px' }}>
                                                {applicationData.practicalExperience?.[index]?.attachment?.fileName ? (
                                                    <Typography 
                                                        variant="body2" 
                                                        component="a" 
                                                        href="#" 
                                                        onClick={(e) => { e.preventDefault(); alert(`Mock downloading ${applicationData.practicalExperience[index].attachment.fileName}`) }} 
                                                        sx={{ textDecoration: 'underline', color: 'primary.main', fontSize: '0.8rem', mr: 0.75 }}
                                                    >
                                                        {applicationData.practicalExperience[index].attachment.fileName}
                                                    </Typography>
                                                ) : (
                                                    <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.8rem' }}>No attachment</Typography>
                                                )}
                                                {applicationData.practicalExperience?.[index]?.attachment?.fileSize && (
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        ({applicationData.practicalExperience[index].attachment.fileSize})
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </FormItem>
                                </Grid>
                            </Box>
                        ))}
                        {editMode && (
                            <Button
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    const newExp = { 
                                        startDate: '', 
                                        endDate: '', 
                                        position: '', 
                                        company: '', 
                                        description: '',
                                        attachment: { fileName: '', fileSize: '' }
                                    };
                                    const updatedExperience = [...(editableData.practicalExperience || []), newExp];
                                    handleFieldChange('practicalExperience', updatedExperience); // Assuming handleFieldChange can update a top-level array
                                }}
                                sx={{ mt: 1 }}
                            >
                                Add Experience
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Qualifications Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Qualifications" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={2}>
                            {editableData.qualifications?.map((qual, index) => (
                                <Grid item xs={12} md={6} key={qual.qualificationType + index}> {/* Use editableData for mapping in edit mode */}
                                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Grid container spacing={1.5} alignItems="flex-start" sx={{ flexGrow: 1 }}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'medium', fontSize: '0.85rem', mb: 0.5, color: 'primary.dark' }}>
                                                    {qual.qualificationType === 'registeredProfessionalEngineer' && 'Registered Professional Engineer'}
                                                    {qual.qualificationType === 'corporateMemberHKIE' && 'Corporate Member of HKIE'}
                                                    {qual.qualificationType === 'equivalentQualification' && 'Equivalent Qualification'}
                                                    {qual.qualificationType === 'other' && 'Other Qualification'}
                                                    {!['registeredProfessionalEngineer', 'corporateMemberHKIE', 'equivalentQualification', 'other'].includes(qual.qualificationType) && qual.qualificationType}
                                                </Typography>
                                            </Grid>

                                            {qual.qualificationType !== 'other' && (
                                                <>
                                                    <FormItem label="Date of Qualified" editMode={editMode} sm={6}
                                                        value={applicationData.qualifications?.[index]?.dateOfQualification ? new Date(applicationData.qualifications[index].dateOfQualification).toLocaleDateString() : null}
                                                    >
                                                        {editMode && <TextField {...commonTextFieldProps(editableData.qualifications?.[index]?.dateOfQualification, (e) => handleArrayObjectChange('qualifications', index, 'dateOfQualification', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                                                    </FormItem>
                                                    <FormItem label="Membership No." editMode={editMode} sm={6}
                                                        value={applicationData.qualifications?.[index]?.membershipNo}
                                                        editValue={editableData.qualifications?.[index]?.membershipNo}
                                                        onChange={(e) => handleArrayObjectChange('qualifications', index, 'membershipNo', e.target.value)}
                                                    />
                                                    {qual.qualificationType === 'equivalentQualification' && (
                                                        <FormItem label="Professional Body (for Reciprocal Recognition)"
                                                            editMode={editMode}
                                                            xs={12} sm={12} md={12} lg={12}
                                                            value={applicationData.qualifications?.[index]?.professionalBody}
                                                        >
                                                            {editMode && <TextField {...commonTextFieldProps(editableData.qualifications?.[index]?.professionalBody, (e) => handleArrayObjectChange('qualifications', index, 'professionalBody', e.target.value))} multiline rows={2} />}
                                                        </FormItem>
                                                    )}
                                                    <Grid item xs={12}>
                                                        <Typography variant="caption" color="textSecondary" display="block" fontWeight="bold" sx={{ fontSize: '0.7rem', mb: 0.5 }}>Disciplines</Typography>
                                                        {editableData.qualifications?.[index]?.disciplines && editableData.qualifications[index].disciplines.length > 0 ? (
                                                            editableData.qualifications[index].disciplines.map(disciplineName => {
                                                                const attachment = editableData.qualifications[index].disciplineAttachments?.find(att => att.discipline === disciplineName);
                                                                const originalAttachment = applicationData.qualifications?.[index]?.disciplineAttachments?.find(att => att.discipline === disciplineName);
                                                                return (
                                                                    <Box key={disciplineName} sx={{ mb: 1, p: 0.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 0 } }}>
                                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 'medium', minWidth: '60px' }}>{disciplineName}:</Typography>
                                                                        {editMode ? (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', my:0.5 }}>
                                                                                <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', bgcolor:'grey.100', p:0.75, borderRadius:1, minHeight:'38px', display:'flex', alignItems:'center'}}>
                                                                                    {attachment?.fileName || 'No file'}
                                                                                    {attachment?.fileName && attachment?.fileSize && <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>({attachment.fileSize})</Typography>}
                                                                                </Typography>
                                                                                <Button 
                                                                                    variant="outlined" 
                                                                                    size="small" 
                                                                                    onClick={() => {
                                                                                        const newFileName = window.prompt('Enter new file name:', attachment?.fileName);
                                                                                        if (newFileName) {
                                                                                            const newFileSize = `${(Math.random() * 2 + 0.5).toFixed(1)}MB`;
                                                                                            handleQualificationAttachmentChange(index, disciplineName, { fileName: newFileName, fileSize: newFileSize });
                                                                                        }
                                                                                    }}
                                                                                    sx={{ height:'38px', flexShrink:0, fontSize:'0.7rem'}}
                                                                                >
                                                                                    Replace
                                                                                </Button>
                                                                            </Box>
                                                                        ) : (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 1 }}>
                                                                                <Typography variant="body2" component="a" href="#" onClick={(e) => { e.preventDefault(); alert(`Mock downloading ${originalAttachment?.fileName}`) }} sx={{ textDecoration: 'underline', color: 'primary.main', fontSize: '0.8rem', mr: 0.75 }}>{renderValue(originalAttachment?.fileName, 'Not Specified')}</Typography>
                                                                                {originalAttachment?.fileName && <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>({originalAttachment?.fileSize || 'N/A'})</Typography>}
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                );
                                                            })
                                                        ) : (
                                                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'italic', ml: 1 }}>No disciplines specified.</Typography>
                                                        )}
                                                    </Grid>
                                                </>
                                            )}



                                            {qual.qualificationType === 'other' && (
                                                <>
                                                    <FormItem label="Date of Qualified" editMode={editMode} sm={6} md={6}
                                                        value={applicationData.qualifications?.[index]?.dateOfQualification ? new Date(applicationData.qualifications[index].dateOfQualification).toLocaleDateString() : null}
                                                    >
                                                        {editMode && <TextField {...commonTextFieldProps(editableData.qualifications?.[index]?.dateOfQualification, (e) => handleArrayObjectChange('qualifications', index, 'dateOfQualification', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                                                    </FormItem>
                                                    <FormItem label="Membership No." editMode={editMode} sm={6} md={6}
                                                        value={applicationData.qualifications?.[index]?.membershipNo}
                                                        editValue={editableData.qualifications?.[index]?.membershipNo}
                                                        onChange={(e) => handleArrayObjectChange('qualifications', index, 'membershipNo', e.target.value)}
                                                    />
                                                    <FormItem label='Description (Please read the attached "Notes to Applicant" Item 2.2)'
                                                        editMode={editMode}
                                                        xs={12} sm={12} md={12} lg={12}
                                                        value={applicationData.qualifications?.[index]?.description}
                                                    >
                                                        {editMode && <TextField {...commonTextFieldProps(editableData.qualifications?.[index]?.description, (e) => handleArrayObjectChange('qualifications', index, 'description', e.target.value))} multiline rows={2} />}
                                                    </FormItem>
                                                    <Grid item xs={12} sx={{ mt: 0.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', p: 0.5 }}>
                                                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'medium', minWidth: '60px' }}>Attachment:</Typography>
                                                            {editMode ? (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', my:0.5 }}>
                                                                    <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', bgcolor:'grey.100', p:0.75, borderRadius:1, minHeight:'38px', display:'flex', alignItems:'center'}}>
                                                                        {editableData.qualifications?.[index]?.otherAttachment?.fileName || 'No file'}
                                                                        {editableData.qualifications?.[index]?.otherAttachment?.fileName && editableData.qualifications?.[index]?.otherAttachment?.size && <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>({editableData.qualifications[index].otherAttachment.size})</Typography>}
                                                                    </Typography>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        size="small" 
                                                                        onClick={() => {
                                                                            const currentAttachment = editableData.qualifications?.[index]?.otherAttachment;
                                                                            const newFileName = window.prompt('Enter new file name:', currentAttachment?.fileName);
                                                                            if (newFileName) {
                                                                                const newFileSize = `${(Math.random() * 2 + 0.5).toFixed(1)}MB`;
                                                                                handleQualificationAttachmentChange(index, 'other', { fileName: newFileName, fileSize: newFileSize });
                                                                            }
                                                                        }}
                                                                        sx={{ height:'38px', flexShrink:0, fontSize:'0.7rem'}}
                                                                    >
                                                                        Replace
                                                                    </Button>
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 1 }}>
                                                                    <Typography variant="body2" component="a" href="#" onClick={(e) => { e.preventDefault(); alert(`Mock downloading ${applicationData.qualifications?.[index]?.otherAttachment?.fileName}`) }} sx={{ textDecoration: 'underline', color: 'primary.main', fontSize: '0.8rem', mr: 0.75 }}>{renderValue(applicationData.qualifications?.[index]?.otherAttachment?.fileName, 'Not Specified')}</Typography>
                                                                    {applicationData.qualifications?.[index]?.otherAttachment?.fileName && <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>({applicationData.qualifications?.[index]?.otherAttachment?.size || 'N/A'})</Typography>}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Grid>


                                                </>
                                            )}
                                        </Grid>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Supporting Documents Checklist Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Supporting Documents Checklist" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        {editableData.supportingDocuments?.map((doc, index) => ( // Use editableData for mapping
                            <Grid container spacing={1.5} key={doc.id || index} alignItems="center" sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                                <FormItem label="Document Type" editMode={editMode} sm={7} md={6}
                                    value={applicationData.supportingDocuments?.[index]?.documentType}
                                    editValue={doc.documentType} // doc from editableData
                                    onChange={(e) => handleArrayObjectChange('supportingDocuments', index, 'documentType', e.target.value)}
                                />
                                <FormItem label="File Name (if attached)" editMode={editMode} sm={5} md={6}
                                    value={applicationData.supportingDocuments?.[index]?.fileName}
                                    editValue={doc.fileName} // doc from editableData
                                    onChange={(e) => handleArrayObjectChange('supportingDocuments', index, 'fileName', e.target.value)}
                                />
                                {/* We can also add a status field here if needed, like in CaseDetailTabs */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormItem label="Status" editMode={editMode} value={applicationData.supportingDocuments?.[index]?.status} editValue={doc.status}>
                                        {editMode && <Select
                                            value={doc.status || ''}
                                            onChange={(e) => handleArrayObjectChange('supportingDocuments', index, 'status', e.target.value)}
                                            disabled={!editMode}
                                            displayEmpty
                                            inputProps={{ sx: { fontSize: '0.875rem', p: '8.5px 14px' } }}
                                            sx={{ mt: 0, bgcolor: 'white', borderRadius: 1, width: '100%' }}
                                        >
                                            <MenuItem value="attached" sx={{ fontSize: '0.875rem' }}>Attached</MenuItem>
                                            <MenuItem value="pending" sx={{ fontSize: '0.875rem' }}>Pending</MenuItem>
                                            <MenuItem value="not_required" sx={{ fontSize: '0.875rem' }}>Not Required</MenuItem>
                                            <MenuItem value="waived" sx={{ fontSize: '0.875rem' }}>Waived</MenuItem>
                                        </Select>}
                                    </FormItem>
                                </Grid>
                            </Grid>
                        ))}
                    </CardContent>
                </Card>

                {/* Declarations & Consents Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Declarations & Consents" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={0.5} alignItems="center"> {/* Reduced spacing for checkboxes */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel control={<Checkbox checked={editableData.applicantInfo?.declaration?.knowledge || false} onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', 'knowledge', e.target.checked)} disabled={!editMode} size="small" />} label="Knowledge of Regulations" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel control={<Checkbox checked={editableData.applicantInfo?.declaration?.dataAccuracy || false} onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', 'dataAccuracy', e.target.checked)} disabled={!editMode} size="small" />} label="Accuracy of Information" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}> {/* Adjusted criminalRecord logic */}
                                <FormControlLabel
                                    control={<Checkbox checked={editableData.applicantInfo?.declaration?.criminalRecord === 'have'} onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', 'criminalRecord', e.target.checked ? 'have' : 'haveNot')} disabled={!editMode} size="small" />}
                                    label="Criminal Record (Declare if any)" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel control={<Checkbox checked={editableData.regulatoryCompliance?.antiCorruptionDeclaration || false} onChange={(e) => handleSimpleFieldChange('regulatoryCompliance', 'antiCorruptionDeclaration', e.target.checked)} disabled={!editMode} size="small" />} label="Anti-Corruption" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel control={<Checkbox checked={editableData.regulatoryCompliance?.dataPrivacyConsent || false} onChange={(e) => handleSimpleFieldChange('regulatoryCompliance', 'dataPrivacyConsent', e.target.checked)} disabled={!editMode} size="small" />} label="Data Privacy Consent" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} sx={{ mt: { xs: 1, md: 0 } }}>
                                <FormItem label="Signature Date" editMode={editMode}
                                    value={applicationData.applicantInfo?.signature?.date ? new Date(applicationData.applicantInfo.signature.date).toLocaleDateString() : null}
                                >
                                    {editMode && <TextField {...commonTextFieldProps(editableData.applicantInfo?.signature?.date, (e) => handleNestedFieldChange('applicantInfo', 'signature', 'date', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                                </FormItem>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Application Fee & Submission Card */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Application Fee & Submission" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            <FormItem label="Fee Amount" editMode={editMode} md={3}
                                value={applicationData.applicationFee?.amount ? `${applicationData.applicationFee.amount} ${applicationData.applicationFee.currency}` : null}
                                editValue={editableData.applicationFee?.amount}
                                onChange={(e) => handleNestedFieldChange('applicationFee', null, 'amount', e.target.value)}
                            />
                            <FormItem label="Currency" editMode={editMode} md={3}
                                value={applicationData.applicationFee?.currency}
                                editValue={editableData.applicationFee?.currency}
                                onChange={(e) => handleNestedFieldChange('applicationFee', null, 'currency', e.target.value)}
                            />
                            <FormItem label="Payment Method" editMode={editMode} md={3}
                                value={applicationData.applicationFee?.paymentMethod}
                                editValue={editableData.applicationFee?.paymentMethod}
                                onChange={(e) => handleNestedFieldChange('applicationFee', null, 'paymentMethod', e.target.value)}
                            />
                            <FormItem label="Payment Reference" editMode={editMode} md={3}
                                value={applicationData.applicationFee?.referenceNumber}
                                editValue={editableData.applicationFee?.referenceNumber}
                                onChange={(e) => handleNestedFieldChange('applicationFee', null, 'referenceNumber', e.target.value)}
                            />
                            <FormItem label="Submission Method" editMode={editMode} md={3}
                                value={applicationData.submissionInfo?.submissionMethod}
                                editValue={editableData.submissionInfo?.submissionMethod}
                                onChange={(e) => handleSimpleFieldChange('submissionInfo', 'submissionMethod', e.target.value)}
                            />
                        </Grid>
                    </CardContent>
                </Card>

                {/* Disclosure Preferences Card */}
                <Card sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Disclosure Preferences" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={6} >
                                <FormControlLabel control={<Checkbox checked={editableData.disclosurePreferences?.emailDisclosure || false} onChange={(e) => handleSimpleFieldChange('disclosurePreferences', 'emailDisclosure', e.target.checked)} disabled={!editMode} size="small" />} label="Allow Email Disclosure" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <FormControlLabel control={<Checkbox checked={editableData.disclosurePreferences?.phoneDisclosure || false} onChange={(e) => handleSimpleFieldChange('disclosurePreferences', 'phoneDisclosure', e.target.checked)} disabled={!editMode} size="small" />} label="Allow Phone Disclosure" sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    // Placeholder for other application types like COCR S1
    if (applicationType === 'COCR S1') {
        // Simplified version based on CaseDetailTabs for COCR S1
        // This will need to be expanded to match WBRSApplicationTabs if it also handles COCR S1 in detail
        return (
            <Box>
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Building Information" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            <FormItem label="Building Name (English)" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.name?.english}
                                editValue={editableData.buildingInfo?.name?.english}
                                onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', 'english', e.target.value)}
                            />
                            <FormItem label="Building Name (Chinese)" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.name?.chinese}
                                editValue={editableData.buildingInfo?.name?.chinese}
                                onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', 'chinese', e.target.value)}
                            />
                            <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary" display="block" fontWeight="bold" sx={{ fontSize: '0.7rem', mb: 0.25 }}>Building Address</Typography>
                                {editMode ? (
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={3}><TextField {...commonTextFieldProps(editableData.buildingInfo?.address?.streetNo, (e) => handleAddressChange('buildingInfo', 'address', 'streetNo', e.target.value))} label="Street No." /></Grid>
                                        <Grid item xs={12} sm={5}><TextField {...commonTextFieldProps(editableData.buildingInfo?.address?.streetEnglish, (e) => handleAddressChange('buildingInfo', 'address', 'streetEnglish', e.target.value))} label="Street (English)" /></Grid>
                                        <Grid item xs={12} sm={4}><TextField {...commonTextFieldProps(editableData.buildingInfo?.address?.districtEnglish, (e) => handleAddressChange('buildingInfo', 'address', 'districtEnglish', e.target.value))} label="District (English)" /></Grid>
                                        {/* Add Chinese address fields if needed */}
                                    </Grid>
                                ) : (<Typography {...commonDisplayTypographyProps}>{renderAddress(applicationData.buildingInfo?.address)}</Typography>)}
                            </Grid>
                            <FormItem label="Building Category" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.buildingCategory?.join(", ")}
                                editValue={editableData.buildingInfo?.buildingCategory?.join(", ")} // Simplified for now
                                onChange={(e) => handleNestedFieldChange('buildingInfo', null, 'buildingCategory', e.target.value.split(",").map(s => s.trim()))}
                            />
                            <FormItem label="Lot Number" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.lotNo}
                                editValue={editableData.buildingInfo?.lotNo}
                                onChange={(e) => handleNestedFieldChange('buildingInfo', null, 'lotNo', e.target.value)}
                            />
                            <FormItem label="Total Gross Floor Area (m²)" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.grossFloorArea?.total}
                                editValue={editableData.buildingInfo?.grossFloorArea?.total}
                                onChange={(e) => handleNestedFieldChange('buildingInfo', 'grossFloorArea', 'total', parseFloat(e.target.value))}
                            />
                            <FormItem label="Commercial Portion (m²)" editMode={editMode} md={6}
                                value={applicationData.buildingInfo?.grossFloorArea?.commercialPortion}
                                editValue={editableData.buildingInfo?.grossFloorArea?.commercialPortion}
                                onChange={(e) => handleNestedFieldChange('buildingInfo', 'grossFloorArea', 'commercialPortion', parseFloat(e.target.value))}
                            />
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Declaration Information" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            <FormItem label="Submission Purpose" editMode={editMode} md={6}
                                value={applicationData.declarationInfo?.submissionPurpose}
                                editValue={editableData.declarationInfo?.submissionPurpose}
                                onChange={(e) => handleSimpleFieldChange('declarationInfo', 'submissionPurpose', e.target.value)}
                            />
                            <FormItem label="Previous Reference" editMode={editMode} md={6}
                                value={applicationData.declarationInfo?.previousReference}
                                editValue={editableData.declarationInfo?.previousReference}
                                onChange={(e) => handleSimpleFieldChange('declarationInfo', 'previousReference', e.target.value)}
                            />
                            <FormItem label="Consent Date" editMode={editMode} md={4}
                                value={applicationData.declarationInfo?.consentDate}
                            >
                                {editMode && <TextField {...commonTextFieldProps(editableData.declarationInfo?.consentDate, (e) => handleSimpleFieldChange('declarationInfo', 'consentDate', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                            </FormItem>
                            <FormItem label="Construction Start Date" editMode={editMode} md={4}
                                value={applicationData.declarationInfo?.constructionStartDate}
                            >
                                {editMode && <TextField {...commonTextFieldProps(editableData.declarationInfo?.constructionStartDate, (e) => handleSimpleFieldChange('declarationInfo', 'constructionStartDate', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                            </FormItem>
                            <FormItem label="Occupancy Approval Date" editMode={editMode} md={4}
                                value={applicationData.declarationInfo?.occupancyApprovalDate}
                            >
                                {editMode && <TextField {...commonTextFieldProps(editableData.declarationInfo?.occupancyApprovalDate, (e) => handleSimpleFieldChange('declarationInfo', 'occupancyApprovalDate', e.target.value))} type="date" InputLabelProps={{ shrink: true }} />}
                            </FormItem>
                        </Grid>
                    </CardContent>
                </Card>
                {/* Supporting Files for COCR S1 */}
                <Card sx={{ mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }} variant="outlined">
                    <CardHeader title="Supporting Files" sx={{ bgcolor: 'grey.50', py: 0.75, px: 1.5, '& .MuiCardHeader-title': { fontSize: '0.9rem', fontWeight: 'medium', color: 'primary.main' } }} />
                    <CardContent sx={{ p: "12px !important" }}>
                        <Grid container spacing={1.5}>
                            {editableData.supportingFiles?.map((doc, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <FormItem label={doc.type || `File ${index + 1}`} editMode={editMode} value={applicationData.supportingFiles?.[index]?.status} editValue={doc.status}>
                                        {editMode && <Select
                                            value={doc.status || ''}
                                            onChange={(e) => handleArrayObjectChange('supportingFiles', index, 'status', e.target.value)}
                                            disabled={!editMode}
                                            displayEmpty
                                            inputProps={{ sx: { fontSize: '0.875rem', p: '8.5px 14px' } }}
                                            sx={{ mt: 0, bgcolor: 'white', borderRadius: 1, width: '100%' }}
                                        >
                                            <MenuItem value="attached" sx={{ fontSize: '0.875rem' }}>Attached</MenuItem>
                                            <MenuItem value="pending" sx={{ fontSize: '0.875rem' }}>Pending</MenuItem>
                                            <MenuItem value="not_required" sx={{ fontSize: '0.875rem' }}>Not Required</MenuItem>
                                        </Select>}
                                    </FormItem>
                                    {doc.status === 'attached' && doc.fileName && !editMode && (
                                        <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', cursor: 'pointer', fontSize: '0.8rem', mt: 0.5, display: 'block' }}>
                                            {doc.fileName}
                                        </Typography>
                                    )}
                                    {editMode && (
                                        <TextField
                                            {...commonTextFieldProps(doc.fileName, (e) => handleArrayObjectChange('supportingFiles', index, 'fileName', e.target.value))}
                                            label="File Name" sx={{ mt: 1 }}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return <Typography sx={{ p: 2 }}>Application form for type '{applicationType}' is not configured in GenericApplicationForm.</Typography>;
};

export default GenericApplicationForm; 