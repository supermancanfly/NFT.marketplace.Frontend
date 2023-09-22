import { InjectedConnector } from '@web3-react/injected-connector';
// import WalletConnect from "@walletconnect/client";
import QRCodeModal from '@walletconnect/qrcode-modal';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import dotenv from "dotenv";
dotenv.config();

export const POLLING_INTERVAL = 12000;

export const ERC20Address = '0x9a0e391806C16FE37C06b532956555B74F31b144';
export const HouseBusinessAddress = '0x7c63Fe06B85704C3db058b10F395095B0D8b353D';
export const MarketplaceAddress = '0x47b828b985f237456944049ED5551ce8DF399875'
export const HouseDocAddress = '0x5fF4a96996523F47851865a12925211C0088fa37';
export const StakingAddress = '0x14846AFd92cb9e0aCC2d8cddE5f6eF0F173d344d';
export const ThirdPartyAddress = '0x94C14Bf448973ED68063492123Ae2a8d33B6FA6A';
export const OperatorAddress = '0xC90434Ea7c1cea82e1bF9865b9D326520096D84D';

// export const ERC20Address = '0x6a92D526b158aB254D03c910a124EA247C660D7a';
// export const HouseBusinessAddress = '0xeC5AD0bdFdA5FA6188578bC21A84B37E15C149E4';
// export const MarketplaceAddress = '0x6795BDA1885Dc852eF0e5766775b19D0a114c4f4'
// export const HouseDocAddress = '0x17019852FE78092372D7aaFF263eE9a830a8b662';
// export const StakingAddress = '0xCe5cE8Bd023b982E640700b7192EEa81c2700e79';
// export const ThirdPartyAddress = '0x81D5D798Af7F36b353d574781C9c972F1B149530';
// export const OperatorAddress = '0xE36f633eB8Fd1C93399535F517Da5Ffe7aBf0809';
/*
export const ERC20Address = '0xbE73C7ab8d4f31b87CD9E14a8760689e093782ED';
export const HouseBusinessAddress = '0xB11fF49650e613d034995e0891b7C1aF062E6736';
export const MarketplaceAddress = '0xD5cf8bcF84Ead1A66D7FfeAa96F8c797d28517C4'
export const HouseDocAddress = '0x0425B2E375784F7e8C6b1d7928cCA1D4E32e7151';
export const StakingAddress = '0x18C1e7B5C3F8D6A34e2534720D90f1A0FEc877Ef';
export const ThirdPartyAddress = '0xBaf954ee9FaD1A9D82EC6F0FE25776b685b2657d';
export const OperatorAddress = '0xBC085A460Be99dacb6EFAB9638BDF70bE47284ff';
*/
const config = {
	// development: {
	//   CHAIN_NAME: 'Goerli Testnet',
	//   CHAIN_ID: 5,
	//   CURRENCY: 'ETH',
	//   EXPLORER: 'https://goerli.etherscan.io/',
	//   WEBSOCKET_1: 'wss://goerli.infura.io/ws',
	//   RPC_URL_1: `https://goerli.infura.io/v3/${INFURA_KEY}`,
	//   RPC_URL_2: `https://goerli.infura.io/v3/${INFURA_KEY}`,
	//   RPC_URL_3: `https://goerli.infura.io/v3/${INFURA_KEY}`,
	// },
	development: {
		CHAIN_NAME: "Polygon Testnet",
		CHAIN_ID: 80001,
		CURRENCY: "MATIC",
		EXPLORER: "https://mumbai.polygonscan.com/",
		WEBSOCKET_1: "wss://mumbai-dagger.matic.today",
		RPC_URL_1: "https://matic-mumbai.chainstacklabs.com",
		RPC_URL_2: "https://rpc-mumbai.maticvigil.com",
		// RPC_URL_3: "https://matic-testnet-archive-rpc.bwarelabs.com",
	},
	production: {
		CHAIN_NAME: 'Polygon Mainnet',
		CHAIN_ID: 137,
		CURRENCY: 'MATIC',
		EXPLORER: 'https://polygonscan.com/',
		WEBSOCKET: 'wss://rpc-mainnet.matic.network',
		RPC_URL_1: 'https://matic-mainnet.chainstacklabs.com',
		RPC_URL_2: 'https://rpc-mainnet.maticvigil.com',
		RPC_URL_3: 'https://rpc-mainnet.matic.quiknode.pro',
	},
};

export const networkConfig = config['development'];
// export const apiURL = "http://localhost:8080"; // Development server
export const apiURL = "https://off-backend.azurewebsites.net"; // Production server

export const secretKey = process.env.REACT_APP_ENCRYPTION_SECRET;

export const stripePublishKey = process.env.REACT_APP_STRIPE_API_KEY

export const injected = new InjectedConnector({
	supportedChainIds: [
		1, // Ethereum Mainnet
		5, // Goerli Testnet
		56, // Binance Smart Chain Mainnet
		97, // Binance Smart Chain Testnet
		137, // Polygon Mainnet
		80001, // Polygon Mumbai Testnet
	],
});

export const walletconnect = new WalletConnectConnector({
	rpcUrl: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
	bridge: 'https://bridge.walletconnect.org',
	qrcodeModal: QRCodeModal,
	qrcode: true,
});

export const walletlink = new WalletLinkConnector({
	url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
	appName: 'web3-react-demo',
});

export const connectorsByName = {
	injected: injected,
	walletConnect: walletconnect,
	coinbaseWallet: walletlink,
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';
