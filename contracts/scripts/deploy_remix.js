/**
 * SCRIPT DEPLOY CHUYÊN DỤNG CHO REMIX IDE (https://app.remix.live)
 * 
 * Cách chạy trong Remix IDE:
 * 1. Mở Remix IDE tại https://app.remix.live
 * 2. Chọn tab "Solidity Compiler" -> Chọn compiler 0.8.24 hoặc 0.8.34, bật Optimize (runs=200)
 * 3. Compile lần lượt 4 file trong thư mục contracts hoặc flattened/
 * 4. Chuột phải vào file scripts/deploy_remix.js trong File Explorer của Remix -> Chọn "Run"
 * 
 * Script này sẽ tự động:
 * - Deploy RiftToken ($RIFT)
 * - Deploy RiftCardNFT (ERC-1155)
 * - Deploy RiftBoosterPack (Gacha)
 * - Deploy RiftMarketplace (Sàn giao dịch)
 * - Cấp quyền authorized minter cho BoosterPack
 * - Xuất toàn bộ địa chỉ Contract và cấu hình JSON để lưu vào dự án!
 */

(async () => {
  try {
    console.log("==================================================");
    console.log("🚀 BẮT ĐẦU TRIỂN KHAI RIFTBOUND TCG TRÊN REMIX IDE");
    console.log("==================================================");

    // Xác định Provider & Signer trong Remix
    let provider;
    let signer;

    if (typeof remix !== "undefined" && remix.provider) {
      provider = new ethers.BrowserProvider(remix.provider);
      signer = await provider.getSigner();
    } else if (typeof window !== "undefined" && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    } else if (typeof ethers !== "undefined") {
      const signers = await ethers.getSigners();
      signer = signers[0];
      provider = signer.provider;
    } else {
      throw new Error("Không tìm thấy Web3/Ethers Provider trong Remix!");
    }

    const deployerAddress = await signer.getAddress();
    const network = await provider.getNetwork();
    console.log("-> Deployer Account:", deployerAddress);
    console.log("-> Chain ID:", network.chainId.toString());

    const treasury = deployerAddress;
    const royaltyVault = deployerAddress;
    const royaltyBps = 250; // 2.5%
    const baseURI = "http://localhost:5000/api/v1/cards/metadata/";

    // Helper lấy Artifact trong Remix hoặc Hardhat
    const getArtifact = async (contractName) => {
      if (typeof remix !== "undefined" && remix.call) {
        try {
          return await remix.call("compilerMetadata", "getArtifact", `contracts/${contractName}.sol`, contractName);
        } catch (e) {
          try {
            return await remix.call("compilerMetadata", "getArtifact", `flattened/${contractName}_flat.sol`, contractName);
          } catch (err) {
            console.warn("Không tìm thấy metadata qua remix.call, thử require...");
          }
        }
      }
      // Hardhat / Ethers standard
      if (typeof ethers.getContractFactory === "function") {
        return await ethers.getContractFactory(contractName);
      }
      throw new Error(`Vui lòng compile hợp đồng ${contractName} trong tab Solidity Compiler trước khi chạy script!`);
    };

    // 1. Deploy RiftToken
    console.log("\n1/4. Đang Deploy RiftToken ($RIFT)...");
    let riftToken;
    let riftTokenAddress;
    try {
      const RiftTokenFactory = await getArtifact("RiftToken");
      if (RiftTokenFactory.deploy) {
        riftToken = await RiftTokenFactory.deploy(deployerAddress);
        await riftToken.waitForDeployment();
        riftTokenAddress = await riftToken.getAddress();
      } else {
        const factory = new ethers.ContractFactory(RiftTokenFactory.abi, RiftTokenFactory.data.bytecode.object, signer);
        riftToken = await factory.deploy(deployerAddress);
        await riftToken.waitForDeployment();
        riftTokenAddress = await riftToken.getAddress();
      }
      console.log("✅ RiftToken Deployed tại:", riftTokenAddress);
    } catch (e) {
      console.error("Lỗi deploy RiftToken:", e);
      throw e;
    }

    // 2. Deploy RiftCardNFT
    console.log("\n2/4. Đang Deploy RiftCardNFT (ERC-1155)...");
    let cardNFT;
    let cardNFTAddress;
    try {
      const CardNFTFactory = await getArtifact("RiftCardNFT");
      if (CardNFTFactory.deploy) {
        cardNFT = await CardNFTFactory.deploy(deployerAddress, baseURI, royaltyVault, royaltyBps);
        await cardNFT.waitForDeployment();
        cardNFTAddress = await cardNFT.getAddress();
      } else {
        const factory = new ethers.ContractFactory(CardNFTFactory.abi, CardNFTFactory.data.bytecode.object, signer);
        cardNFT = await factory.deploy(deployerAddress, baseURI, royaltyVault, royaltyBps);
        await cardNFT.waitForDeployment();
        cardNFTAddress = await cardNFT.getAddress();
      }
      console.log("✅ RiftCardNFT Deployed tại:", cardNFTAddress);
    } catch (e) {
      console.error("Lỗi deploy RiftCardNFT:", e);
      throw e;
    }

    // 3. Deploy RiftBoosterPack
    console.log("\n3/4. Đang Deploy RiftBoosterPack...");
    let boosterPack;
    let boosterPackAddress;
    try {
      const BoosterFactory = await getArtifact("RiftBoosterPack");
      if (BoosterFactory.deploy) {
        boosterPack = await BoosterFactory.deploy(deployerAddress, riftTokenAddress, cardNFTAddress, treasury);
        await boosterPack.waitForDeployment();
        boosterPackAddress = await boosterPack.getAddress();
      } else {
        const factory = new ethers.ContractFactory(BoosterFactory.abi, BoosterFactory.data.bytecode.object, signer);
        boosterPack = await factory.deploy(deployerAddress, riftTokenAddress, cardNFTAddress, treasury);
        await boosterPack.waitForDeployment();
        boosterPackAddress = await boosterPack.getAddress();
      }
      console.log("✅ RiftBoosterPack Deployed tại:", boosterPackAddress);
    } catch (e) {
      console.error("Lỗi deploy RiftBoosterPack:", e);
      throw e;
    }

    // Cấp quyền đúc thẻ cho BoosterPack
    console.log("-> Đang cấp quyền Minter cho BoosterPack...");
    const txAuth = await cardNFT.setAuthorizedMinter(boosterPackAddress, true);
    await txAuth.wait();
    console.log("✅ Đã cấp quyền Authorized Minter cho BoosterPack thành công.");

    // 4. Deploy RiftMarketplace
    console.log("\n4/4. Đang Deploy RiftMarketplace...");
    let marketplace;
    let marketplaceAddress;
    try {
      const MarketFactory = await getArtifact("RiftMarketplace");
      if (MarketFactory.deploy) {
        marketplace = await MarketFactory.deploy(deployerAddress, riftTokenAddress, treasury);
        await marketplace.waitForDeployment();
        marketplaceAddress = await marketplace.getAddress();
      } else {
        const factory = new ethers.ContractFactory(MarketFactory.abi, MarketFactory.data.bytecode.object, signer);
        marketplace = await factory.deploy(deployerAddress, riftTokenAddress, treasury);
        await marketplace.waitForDeployment();
        marketplaceAddress = await marketplace.getAddress();
      }
      console.log("✅ RiftMarketplace Deployed tại:", marketplaceAddress);
    } catch (e) {
      console.error("Lỗi deploy RiftMarketplace:", e);
      throw e;
    }

    // KẾT QUẢ ĐỂ LƯU CONTRACT
    const deployedConfig = {
      network: network.name === "unknown" ? "localhost" : network.name,
      chainId: Number(network.chainId),
      contracts: {
        RiftToken: riftTokenAddress,
        RiftCardNFT: cardNFTAddress,
        RiftBoosterPack: boosterPackAddress,
        RiftMarketplace: marketplaceAddress
      },
      treasury: treasury,
      deployedAt: new Date().toISOString()
    };

    console.log("\n==================================================");
    console.log("🎉 DEPLOY TOÀN BỘ 4 HỢP ĐỒNG THÀNH CÔNG TRÊN REMIX!");
    console.log("==================================================");
    console.log("📋 DỮ LIỆU CẤU HÌNH ĐỂ LƯU VÀO shared/contracts-config.json:");
    console.log(JSON.stringify(deployedConfig, null, 2));
    console.log("==================================================");
    console.log("💡 LỆNH LƯU TỰ ĐỘNG VÀO DỰ ÁN TỪ TERMINAL:");
    console.log(`node scripts/save_deployed.js --token ${riftTokenAddress} --nft ${cardNFTAddress} --pack ${boosterPackAddress} --market ${marketplaceAddress} --chainId ${network.chainId.toString()}`);
    console.log("==================================================\n");

  } catch (error) {
    console.error("❌ Có lỗi xảy ra trong quá trình Deploy:", error);
  }
})();
