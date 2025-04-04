# 常見問題｜ NewbeePaste 使用指南

這裡匯集了用戶在使用 NewbeePaste 過程中可能遇到的一些常見問題及其解答。

## 基礎使用問題

### 如何啟動 NewbeePaste？

安裝完成後，NewbeePaste 會自動在系統托盤（Windows）或選單列（macOS）中運行。您可以通過以下方式打開主界面：

- **Windows**: 按下 `Alt + V` 快捷鍵（默認）
- **macOS**: 按下 `Option + V` 快捷鍵（默認，可根據您的系統設置調整）
- 或**點擊系統托盤/選單列圖標**

### 為什麼有時候複製的內容沒有出現在 NewbeePaste 歷史記錄裡？

可能的原因包括：

- NewbeePaste 未運行或剪貼簿監聽功能被關閉。
- 複製的內容被設置的「忽略規則」或「隱私模式」過濾掉了。
- 應用權限不足，無法監聽到剪貼簿變化（尤其在 macOS 上需要輔助功能權限）。
- 複製的內容格式過於特殊或過大，超出了處理範圍。

### 為什麼有時候複製的內容沒有同步到其他設備？

以下情況可能導致內容未能成功同步：

- **網絡連接問題**：請檢查當前設備的網絡連接是否正常。
- **賬號未登錄**：確保所有需要同步的設備都登錄了同一個 NewbeePaste 賬號。
- **同步開關關閉**：檢查設置中對應設備的同步開關是否開啟。
- **內容大小超限**：如果要同步的文件或圖片大小超過了您在設置中設定的限制（或會員等級限制）。
- **關鍵詞過濾**：檢查是否設置了關鍵詞過濾規則，導致該內容被阻止同步。
- **伺服器問題**：極少數情況下可能是伺服器臨時故障。

### 如何管理同步的設備？

1. 打開 NewbeePaste **設置**界面。
2. 切換到 **「設備管理」** 選項卡。
3. 在這裡您可以看到所有已登錄並關聯此賬號的設備列表及其在線狀態。
4. 您可以為設備重命名，或點擊設備旁邊的按鈕（通常是「解除綁定」或類似操作）來斷開該設備與您賬號的同步連接。

## 功能使用

### 如何固定（收藏）常用的剪貼簿內容？

1. 打開 NewbeePaste 主界面，找到您想要固定的那條歷史記錄。
2. 將滑鼠懸停在該條目上。
3. 通常會顯示一個**星形**圖標或者「收藏」按鈕，點擊它。
4. 被固定的內容會出現在「收藏」分類中，並且在主列表裡可能會置頂顯示（具體行為取決於設置）。

### 為什麼有些圖片無法預覽或同步？

- **大小限制**：圖片文件大小可能超過了您在設置中配置的同步大小限制。
- **格式不支持**：雖然支持常見格式（PNG, JPG 等），但某些非常規或損壞的圖片格式可能無法正確處理。
- **網絡問題**：同步大圖片需要穩定的網絡連接和足夠的頻寬。
- **存儲空間**：雲端存儲空間不足。

## 性能優化

### 軟件感覺有點卡頓或佔用內存過大怎麼辦？

1. **調整歷史記錄數量**：在設置中，減少「歷史記錄保留數量」或縮短「歷史記錄保留時間」（如從「永久」改為「30 天」）。
2. **清理歷史記錄**：手動或定期清理不再需要的舊剪貼簿記錄，特別是大的圖片或文件記錄。
3. **關閉非必要功能**：如果您不需要某些高級功能（如劃詞翻譯、圖片自動 OCR 等），可以在設置中將其關閉。
4. **檢查版本更新**：確保您使用的是最新版本的 NewbeePaste，開發者可能在新版本中進行了性能優化。
5. **重啟應用/電腦**：簡單的重啟有時能解決臨時的性能問題。

### 如何提升跨設備同步速度？

- **確保網絡環境良好**：使用穩定且速度較快的 Wi-Fi 或有線網絡。
- **優化同步內容**：
  - 在設置中，調整同步文件/圖片的大小上限，避免同步過大的內容。
  - 配置不同步某些類型的內容（如文件）。
- **選擇合適的伺服器節點**（如果應用提供此選項）：選擇地理位置離您較近的同步伺服器。
- **避開高峰時段**：如果網絡擁堵，嘗試在網絡負載較低的時段進行大量同步。
- **關閉其他佔用頻寬的應用**：如下載工具、在線視頻等。

## 其他問題

### NewbeePaste 支持哪些操作系統？

目前官方主要支持：

- **Windows**: Windows 10 及以上版本
- **macOS**: macOS 10.15 及以上版本

請留意官方發布的最新兼容性信息。

### 我的剪貼簿數據安全性如何保證？

NewbeePaste 非常重視用戶數據安全：

- **傳輸加密**：所有賬號相關和同步數據在設備與伺服器之間傳輸時，均採用行業標準的加密方式（如 SSL/TLS）。
- **本地加密**：存儲在本地設備上的敏感數據（如歷史記錄數據庫）會進行加密處理。
- **隱私設置**：提供關鍵詞過濾、忽略特定應用等功能，保護您的隱私。
- **雲端安全**：如果使用雲同步，伺服器也會採取相應的安全措施保護存儲的數據。
- **遠程登出**：支持在設備管理中遠程登出其他設備。

### 如何備份我的 NewbeePaste 數據？

NewbeePaste 的數據備份主要依賴於雲同步：

- 登錄賬號後，您的剪貼簿歷史記錄（文本、圖片信息等，文件本身可能根據設置決定是否同步）會自動**加密存儲在雲端**。
- 當您在新的設備上登錄同一個賬號時，雲端的數據會自動同步到新設備上。
- 因此，**無需用戶手動執行額外的備份操作**，保持賬號登錄和網絡連接即可實現數據的備份與恢復。

### 遇到其他問題怎麼辦？

如果您的問題未能在此處找到答案，可以通過以下途徑獲取幫助：

- **聯繫客服支持**：發送郵件至官方支持郵箱：`support@nbhive.com`。
- **關注官方渠道**：通過產品的官方網站或社交媒體賬號獲取最新信息和支持渠道。

::: tip 提示
建議您在使用中遇到問題時，首先檢查網絡連接、賬號登錄狀態以及相關設置。許多常見問題都可以通過簡單的檢查和調整得以解決。
:::
