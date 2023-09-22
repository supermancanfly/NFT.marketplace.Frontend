import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import styled from "@emotion/styled";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button, Checkbox,
  FormControlLabel, FormLabel, Grid, IconButton, InputBase, MenuItem, Paper, Stack,
  TextField
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import CryptoJS from "crypto-js";

import useHouseMintStyle from "assets/styles/houseMintStyle";
import { useHouseDocContract } from "hooks/useContractHelpers";
import { houseError, houseInfo, houseSuccess } from "hooks/useToast";
import { apiURL, secretKey, zeroAddress } from "mainConfig";
import encryptfile from "utils/encrypt";
import FileUpload from "utils/ipfs";

const Input = styled("input")({
  display: "none",
});

function CreateContract(props) {
  const { account } = useWeb3React();
  const walletAccount = props.account.account;
  const injected = props.account.injected;
  const historyTypes = props.historyTypes.historyTypes;
  const classes = useHouseMintStyle();
  const houseDocContract = useHouseDocContract();
  const navigate = useNavigate();
  // Contract
  const [cFile, setCFile] = useState(null);
  const [cViewFile, setCViewFile] = useState(null);
  const [cFileName, setCFileName] = useState("");

  const [isContractSinger, setIsContractSinger] = useState(false);
  const [contractSigner, setcontractSigner] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contractType, setContractType] = useState(1);
  const [currency, setCurrency] = useState("MATIC");
  const [agreedPrice, setAgreedPrice] = useState("");

  const [contractTypes, setContracTypes] = useState([]);
  const [addContract, setAddContract] = useState("");

  const currencies = [
    {
      value: "MATIC",
      label: "matic",
    },
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
  ];

  const handlePdfChange = async (e) => {
    var uploadedPdf = e.target.files[0];
    var __blob = await encryptfile(uploadedPdf);
    setCFile(__blob)
    setCViewFile(uploadedPdf)
    setCFileName(uploadedPdf.name);
  };

  const handleCreateContract = async () => {
    if (!walletAccount) {
      houseInfo("Please connect your wallet.");
    } else if (
      !companyName ||
      !contractType ||
      !dateFrom ||
      !dateTo ||
      !agreedPrice
    ) {
      houseError("Please input all fields correctly.");
    } else if (cFile) {
      setLoading(true);
      let aSigner;
      if (isContractSinger === true) {
        aSigner = contractSigner;
      } else {
        aSigner = zeroAddress;
      }
      let isValid = Web3.utils.isAddress(aSigner);
      let ipfsUrl = await FileUpload(cFile);
      if (ipfsUrl === false) {
        houseError("Something went wrong with IPFS");
        setLoading(false);
      } else {
        if (isValid) {
          let sDate = new Date(dateFrom).getTime();
          let eDate = new Date(dateTo).getTime();
          if (eDate < sDate) {
            houseError("“Date to” must be later data then Date From”");
            setLoading(false);
          } else {
            // const aPrice = BigNumber.from(`${agreedPrice * 10 ** 18}`);
            const aPrice = Web3.utils.toWei(`${agreedPrice}`, 'ether');
            const ipUrl = CryptoJS.AES.encrypt(ipfsUrl, secretKey).toString();
            const encryptedCompanyName = CryptoJS.AES.encrypt(companyName, secretKey).toString();
            const encryptedCurrency = CryptoJS.AES.encrypt(currency, secretKey).toString();
            if (!injected) {
              const data = houseDocContract.methods
                .hdCreation(
                  encryptedCompanyName,
                  contractType,
                  aSigner,
                  ipUrl,
                  sDate,
                  eDate,
                  aPrice,
                  encryptedCurrency,
                  walletAccount
                ).encodeABI();

              const transactionObject = {
                data,
                to: houseDocContract.options.address
              }

              // Send trx data and sign
              fetch(`${apiURL}/signTransaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionObject,
                  user: walletAccount
                }),
              })
                .then(res => {
                  if (res.status !== 200) {
                    return res.json().then(error => {
                      houseError(`Error: ${error.message}`);
                      setLoading(false);
                    });
                  }
                  houseSuccess("Success");
                  setCFile(null);
                  setCFileName("");
                  setCompanyName("");
                  setcontractSigner("");
                  setContractType(contractType);
                  setDateFrom("");
                  setDateTo("");
                  setAgreedPrice("");
                  setCurrency("MATIC");
                  setIsContractSinger(false);
                  navigate("../../contract/main");
                  setLoading(false);
                })
                .catch(err => {
                  houseError(err)
                  setLoading(false);
                });
            } else {
              try {
                await houseDocContract.methods
                  .hdCreation(
                    encryptedCompanyName,
                    contractType,
                    aSigner,
                    ipUrl,
                    sDate,
                    eDate,
                    aPrice,
                    encryptedCurrency,
                    walletAccount
                  ).send({ from: walletAccount })
                houseSuccess("Success");
                setCFile(null);
                setCFileName("");
                setCompanyName("");
                setcontractSigner("");
                setContractType(contractType);
                setDateFrom("");
                setDateTo("");
                setAgreedPrice("");
                setCurrency("MATIC");
                setIsContractSinger(false);
                navigate("../../contract/main");
              } catch (error) {
                console.log(error);
                houseError("Something went wrong");
              }
              setLoading(false);
            }
          }
        } else {
          houseError("Contract Signer address is invalid");
          setLoading(false);
        }
      }
    } else {
      houseError("Please upload contract file.");
      setLoading(false);
    }
  };

  const ValueUp = () => {
    if ((Number(agreedPrice) + 0.125) < 0) {
      houseError("Agreed price can not be negative");
    } else {
      setAgreedPrice(Number(agreedPrice) + 0.125);
    }
  }

  const ValueDown = () => {
    if ((Number(agreedPrice) - 0.125) < 0) {
      houseError("Agreed price can not be negative");
    } else {
      setAgreedPrice(Number(agreedPrice) - 0.125);
    }
  }

  useEffect(async () => {
    let arr = [];
    historyTypes.map((item, idx) => {
      arr.push({
        idx: idx,
        value: item.hLabel,
        label: item.hLabel,
        flag: item.connectContract
      })
    })
    setContracTypes(arr);
  }, [historyTypes])

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      className={classes.mintContent}
    >
      <Grid component="fieldset" variant="filled">
        <FormLabel component="legend" htmlFor="residence-type-radio">
          Contract Creation
        </FormLabel>
        <Grid sx={{ m: 1 }}>
          <label htmlFor="contained-pdf-file">
            <Input
              accept=".pdf,.doc"
              id="contained-pdf-file"
              multiple
              type="file"
              onChange={handlePdfChange}
            />
            <Button
              variant="contained"
              component="span"
              startIcon={<PictureAsPdfIcon />}
            >
              Upload Contract
            </Button>
          </label>
          {cViewFile ? (
            <Grid className={classes.embedPdf}>
              <embed src={URL.createObjectURL(cViewFile)}></embed>
            </Grid>
          ) : (
            <></>
          )}
          <Grid> {cFileName} </Grid>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            variant="filled"
            label="Company Name"
            placeholder="Company Ltd"
            value={companyName}
            multiline
            onChange={(e) => {
              if (companyName.length < 30) {
                setCompanyName(e.target.value);
              }
            }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            variant="filled"
            label="Company Address"
            placeholder="My address 123"
            value={addContract}
            multiline
            onChange={(e) => {
              if (addContract.length < 30) {
                setAddContract(e.target.value);
              }
            }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isContractSinger}
                onChange={(e) => setIsContractSinger(e.target.checked)}
                name="gilad"
              />
            }
            label="Add Signer (Company)?"
          />
          <TextField
            className={classes.needField}
            variant="filled"
            label="Company Wallet-address"
            placeholder="0x......"
            multiline
            disabled={!isContractSinger}
            onChange={(e) => {
              if (e.target.value === `${walletAccount}`) {
                houseError(
                  "Contract Signer this can not be himself / contract maker"
                );
                setcontractSigner("");
              }
              else {
                setcontractSigner(e.target.value);
              }
            }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            id="filled-select-currency"
            select
            label="Contract Type"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            variant="filled"
          >
            {contractTypes.map((option) => (
              option.flag && <MenuItem key={option.value} value={option.idx}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            onChange={(e) => setDateFrom(e.target.value)}
            value={dateFrom}
            variant="filled"
            id="date"
            label="Date From"
            type="date"
            format={"DD/MM/YYYY"}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            onChange={(e) => setDateTo(e.target.value)}
            value={dateTo}
            variant="filled"
            id="date"
            label="Date To"
            type="date"
            format={"DD/MM/YYYY"}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid sx={{ m: 1, display: 'flex' }}>
          <div className={classes.Mprice}>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ "aria-label": "package" }}
                type="number"
                placeholder={currency}
                value={agreedPrice}
                onChange={(e) => {
                  if (e.target.value < 0 || e.target.value > 999999) {
                    houseError("Agreed price can not be negative or greater then 999999");
                    setAgreedPrice("");
                  } else {
                    setAgreedPrice(e.target.value);
                  }
                }}
              />
            </Paper>
            <div className={classes.Marrow}>
              <IconButton sx={{ p: '0px' }} onClick={ValueUp}>
                <ArrowDropUpIcon />
              </IconButton>
              <IconButton sx={{ p: '0px' }} onClick={ValueDown}>
                <ArrowDropDownIcon />
              </IconButton>
            </div>
          </div>
        </Grid>
        <Grid sx={{ m: 1, display: 'flex' }}>
          <TextField
            id="filled-select-currency"
            select
            label="Select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid sx={{ m: 1 }}>
          <TextField
            className={classes.needField}
            variant="filled"
            label="Contract maker (you)"
            value={walletAccount ? walletAccount : "Please connect your wallet"}
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid sx={{ m: 1 }}>
          <LoadingButton
            onClick={handleCreateContract}
            endIcon={<SaveAsIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Create Contract
          </LoadingButton>
        </Grid>
      </Grid>
    </Stack>
  );
}

function mapStateToProps(state) {
  return {
    account: state.account,
    historyTypes: state.historyTypes
  };
}

export default connect(mapStateToProps)(CreateContract);