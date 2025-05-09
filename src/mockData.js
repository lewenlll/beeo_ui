export const mockBuildings = [
  { 
    id: 'BLD001', 
    address: '123 Main Street, Central District',
    status: 'Active',
    lastInspection: '2023-10-15'
  },
  { 
    id: 'BLD002', 
    address: '456 Park Avenue, Eastern District',
    status: 'Active',
    lastInspection: '2023-09-20'
  },
  { 
    id: 'BLD003', 
    address: '789 Harbor Road, Southern District',
    status: 'Under Review',
    lastInspection: '2023-11-01'
  }
];

export const mockWBRS = [
  {
    applicationNo: 'WBRS001',
    status: 'Pending',
    submissionDate: '2023-11-20',
    buildingId: 'BLD001',
    description: 'Annual water tank inspection report'
  },
  {
    applicationNo: 'WBRS002',
    status: 'Completed',
    submissionDate: '2023-11-15',
    buildingId: 'BLD002',
    description: 'Quarterly water quality test results'
  },
  {
    applicationNo: 'WBRS003',
    status: 'Rejected',
    submissionDate: '2023-11-10',
    buildingId: 'BLD003',
    description: 'Monthly maintenance report'
  }
];

export const mockCases = [
  {
    caseId: 'CASE001',
    officer: 'John Doe',
    status: 'In Progress',
    caseType: 'REA Registration',
    createdDate: '2023-11-20',
    wbrsNo: 'WBRS001',
    description: 'REA registration application',
    applicationForm: {
        "applicationType": "new", // new/renewal/change
        "applicantInfo": {
          "currentCompany": {
            "name": "ABC Engineering Ltd",
            "address": {
              "flat": "12",
              "floor": "3",
              "block": "A",
              "building": "Energy Tower",
              "street": "123 Cyberport Rd",
              "city": "Hong Kong"
            }
          },
          "position": "Senior Energy Engineer",
          "contact": {
            "officePhone": "+852 1234 5678",
            "fax": "+852 8765 4321"
          },
          "declaration": {
            "knowledge": true,
            "criminalRecord": "haveNot",
            "dataAccuracy": true
          },
          "signature": {
            "date": "2023-10-05",
            "imageData": "base64EncodedImageString"
          }
        },
        "qualifications": [
          {
            "type": "professionalEngineer",
            "registrationNumber": "ENG12345",
            "discipline": "BSS",
            "yearOfQualification": 2015,
            "hkieMembership": {
              "corporateMember": true,
              "equivalentQualification": false
            }
          },
          {
            "type": "otherQualification",
            "issuingBody": "Chartered Institution of Building Services Engineers",
            "yearOfQualification": 2018
          }
        ],
        "practicalExperience": [
          {
            "startDate": "2018-03-01",
            "endDate": "2021-08-31",
            "position": "Energy Auditor",
            "company": "XYZ Consultants",
            "description": "Conducted energy audits for 20+ commercial buildings under BEAM Plus certification"
          },
          {
            "startDate": "2021-09-01",
            "endDate": "2023-10-05",
            "position": "Energy Manager",
            "company": "GreenTech Solutions",
            "description": "Led implementation of ISO 50001 energy management system in industrial facilities"
          }
        ],
        "supportingDocuments": [
          {
            "documentType": "professionalQualificationProof",
            "status": "attached"
          },
          {
            "documentType": "experienceVerificationLetter",
            "status": "pending"
          }
        ],
        "disclosurePreferences": {
          "emailDisclosure": true,
          "phoneDisclosure": false
        },
        "applicationFee": {
          "amount": 2100,
          "currency": "HKD",
          "paymentMethod": "cheque",
          "referenceNumber": "EA123456789"
        },
        "submissionInfo": {
          "submissionDate": "2023-10-06",
          "submissionMethod": "inPerson",
          "interviewScheduled": true,
          "interviewTime": "2023-10-12T10:00:00"
        },
        "regulatoryCompliance": {
          "antiCorruptionDeclaration": true,
          "dataPrivacyConsent": true
        }
      }
  },
  {
    caseId: 'CASE002',
    status: 'In Progress',
    createdDate: '2023-11-18',
    buildingId: 'BLD002',
    wbrsNo: 'WBRS002',
    description: 'Maintenance schedule review',
    priority: 'Medium'
  },
  {
    caseId: 'CASE003',
    status: 'Closed',
    createdDate: '2023-11-15',
    buildingId: 'BLD003',
    wbrsNo: 'WBRS003',
    description: 'Documentation update required',
    priority: 'Low'
  }
];