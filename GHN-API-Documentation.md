# GHN API Documentation

Tài liệu chi tiết về các API tích hợp với GHN (Giao Hàng Nhanh) để lấy thông tin địa chỉ.

---

## 1. Lấy danh sách tỉnh/thành phố

### Endpoint
```
GET /ghn/get-list-province
```

### Mô tả
Lấy danh sách tất cả tỉnh/thành phố của Việt Nam từ hệ thống GHN.

### Xác thực
🔓 **PUBLIC** - Không yêu cầu xác thực

### Request

#### Headers
Không yêu cầu headers đặc biệt.

#### Query Parameters
Không có query parameters.

#### Request Body
Không có request body.

#### cURL Example
```bash
curl -X GET "https://api.example.com/ghn/get-list-province"
```

#### JavaScript/TypeScript Example
```javascript
const response = await fetch('https://api.example.com/ghn/get-list-province', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

#### C# Example
```csharp
using HttpClient client = new HttpClient();
var response = await client.GetAsync("https://api.example.com/ghn/get-list-province");
var result = await response.Content.ReadFromJsonAsync<ProvinceResponse>();
```

### Response

#### Status Codes
- **200 OK**: Thành công

#### Response Body Structure
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "provinceID": 202,
      "provinceName": "Hà Nội",
      "code": "HN",
      "updatedSource": "external"
    },
    {
      "provinceID": 201,
      "provinceName": "Hồ Chí Minh",
      "code": "SG",
      "updatedSource": "external"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `code` | `int` | Mã trạng thái (200 = thành công) |
| `message` | `string` | Thông báo từ API |
| `data` | `array` | Danh sách tỉnh/thành phố |

**ProvinceDto Object:**

| Field | Type | Description |
|-------|------|-------------|
| `provinceID` | `int` | ID tỉnh/thành phố (dùng cho API lấy quận/huyện) |
| `provinceName` | `string` | Tên tỉnh/thành phố |
| `code` | `string` | Mã tỉnh/thành phố (ví dụ: "HN", "SG") |
| `updatedSource` | `string` | Nguồn cập nhật (thường là "external") |

#### Example Response
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "provinceID": 202,
      "provinceName": "Hà Nội",
      "code": "HN",
      "updatedSource": "external"
    },
    {
      "provinceID": 201,
      "provinceName": "Hồ Chí Minh",
      "code": "SG",
      "updatedSource": "external"
    },
    {
      "provinceID": 224,
      "provinceName": "Đà Nẵng",
      "code": "DN",
      "updatedSource": "external"
    }
  ]
}
```

---

## 2. Lấy danh sách quận/huyện theo tỉnh

### Endpoint
```
GET /ghn/get-list-district
```

### Mô tả
Lấy danh sách quận/huyện thuộc một tỉnh/thành phố cụ thể từ hệ thống GHN.

### Xác thực
🔓 **PUBLIC** - Không yêu cầu xác thực

### Request

#### Headers
Không yêu cầu headers đặc biệt.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `provinceId` | `int` | ✅ Yes | ID tỉnh/thành phố (lấy từ API `/ghn/get-list-province`) |

#### Request Body
Không có request body.

#### cURL Example
```bash
curl -X GET "https://api.example.com/ghn/get-list-district?provinceId=202"
```

#### JavaScript/TypeScript Example
```javascript
const provinceId = 202; // ID của Hà Nội
const response = await fetch(`https://api.example.com/ghn/get-list-district?provinceId=${provinceId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

#### C# Example
```csharp
using HttpClient client = new HttpClient();
int provinceId = 202; // ID của Hà Nội
var response = await client.GetAsync($"https://api.example.com/ghn/get-list-district?provinceId={provinceId}");
var result = await response.Content.ReadFromJsonAsync<DistrictResponse>();
```

### Response

#### Status Codes
- **200 OK**: Thành công

#### Response Body Structure
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "districtID": 1442,
      "provinceID": 202,
      "districtName": "Quận Ba Đình",
      "code": "BĐ",
      "supportType": 3,
      "type": 2,
      "updatedSource": "external"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `code` | `int` | Mã trạng thái (200 = thành công) |
| `message` | `string` | Thông báo từ API |
| `data` | `array` | Danh sách quận/huyện |

**DistrictDto Object:**

| Field | Type | Description |
|-------|------|-------------|
| `districtID` | `int` | ID quận/huyện (dùng cho API lấy phường/xã) |
| `provinceID` | `int` | ID tỉnh/thành phố mà quận/huyện thuộc về |
| `districtName` | `string` | Tên quận/huyện |
| `code` | `string` | Mã quận/huyện |
| `supportType` | `int` | Loại hỗ trợ vận chuyển (1, 2, hoặc 3) |
| `type` | `int` | Loại địa danh (1 = Quận, 2 = Huyện) |
| `updatedSource` | `string` | Nguồn cập nhật (thường là "external") |

#### Example Response
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "districtID": 1442,
      "provinceID": 202,
      "districtName": "Quận Ba Đình",
      "code": "BĐ",
      "supportType": 3,
      "type": 2,
      "updatedSource": "external"
    },
    {
      "districtID": 1443,
      "provinceID": 202,
      "districtName": "Quận Hoàn Kiếm",
      "code": "HK",
      "supportType": 3,
      "type": 2,
      "updatedSource": "external"
    },
    {
      "districtID": 1444,
      "provinceID": 202,
      "districtName": "Quận Tây Hồ",
      "code": "TH",
      "supportType": 3,
      "type": 2,
      "updatedSource": "external"
    }
  ]
}
```

---

## 3. Lấy danh sách phường/xã theo quận

### Endpoint
```
GET /ghn/get-list-ward
```

### Mô tả
Lấy danh sách phường/xã thuộc một quận/huyện cụ thể từ hệ thống GHN.

### Xác thực
🔓 **PUBLIC** - Không yêu cầu xác thực

### Request

#### Headers
Không yêu cầu headers đặc biệt.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `districtId` | `int` | ✅ Yes | ID quận/huyện (lấy từ API `/ghn/get-list-district`) |

#### Request Body
Không có request body.

#### cURL Example
```bash
curl -X GET "https://api.example.com/ghn/get-list-ward?districtId=1442"
```

#### JavaScript/TypeScript Example
```javascript
const districtId = 1442; // ID của Quận Ba Đình
const response = await fetch(`https://api.example.com/ghn/get-list-ward?districtId=${districtId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

#### C# Example
```csharp
using HttpClient client = new HttpClient();
int districtId = 1442; // ID của Quận Ba Đình
var response = await client.GetAsync($"https://api.example.com/ghn/get-list-ward?districtId={districtId}");
var result = await response.Content.ReadFromJsonAsync<WardResponse>();
```

### Response

#### Status Codes
- **200 OK**: Thành công

#### Response Body Structure
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "wardCode": "1A0401",
      "districtID": 1442,
      "wardName": "Phường Phúc Xá",
      "updatedSource": "external"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `code` | `int` | Mã trạng thái (200 = thành công) |
| `message` | `string` | Thông báo từ API |
| `data` | `array` | Danh sách phường/xã |

**WardDto Object:**

| Field | Type | Description |
|-------|------|-------------|
| `wardCode` | `string` | Mã phường/xã (dùng cho API tạo đơn vận chuyển) |
| `districtID` | `int` | ID quận/huyện mà phường/xã thuộc về |
| `wardName` | `string` | Tên phường/xã |
| `updatedSource` | `string` | Nguồn cập nhật (thường là "external") |

#### Example Response
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "wardCode": "1A0401",
      "districtID": 1442,
      "wardName": "Phường Phúc Xá",
      "updatedSource": "external"
    },
    {
      "wardCode": "1A0402",
      "districtID": 1442,
      "wardName": "Phường Trúc Bạch",
      "updatedSource": "external"
    },
    {
      "wardCode": "1A0403",
      "districtID": 1442,
      "wardName": "Phường Vĩnh Phúc",
      "updatedSource": "external"
    }
  ]
}
```

---

## Flow sử dụng

### Ví dụ: Lấy đầy đủ thông tin địa chỉ

```javascript
// Bước 1: Lấy danh sách tỉnh/thành phố
const provincesResponse = await fetch('https://api.example.com/ghn/get-list-province');
const provinces = await provincesResponse.json();
const haNoi = provinces.data.find(p => p.provinceName === 'Hà Nội');
console.log(`Chọn: ${haNoi.provinceName} (ID: ${haNoi.provinceID})`);

// Bước 2: Lấy danh sách quận/huyện của Hà Nội
const districtsResponse = await fetch(`https://api.example.com/ghn/get-list-district?provinceId=${haNoi.provinceID}`);
const districts = await districtsResponse.json();
const baDinh = districts.data.find(d => d.districtName === 'Quận Ba Đình');
console.log(`Chọn: ${baDinh.districtName} (ID: ${baDinh.districtID})`);

// Bước 3: Lấy danh sách phường/xã của Quận Ba Đình
const wardsResponse = await fetch(`https://api.example.com/ghn/get-list-ward?districtId=${baDinh.districtID}`);
const wards = await wardsResponse.json();
const phucXa = wards.data.find(w => w.wardName === 'Phường Phúc Xá');
console.log(`Chọn: ${phucXa.wardName} (WardCode: ${phucXa.wardCode})`);

// Kết quả
console.log(`Địa chỉ đầy đủ: ${phucXa.wardName}, ${baDinh.districtName}, ${haNoi.provinceName}`);
```

---

## Lưu ý

1. **Lọc dữ liệu**: API tự động lọc bỏ các bản ghi có `updatedSource = "internal"`, chỉ trả về dữ liệu từ nguồn external.

2. **ID mapping**: 
   - Sử dụng `provinceID` để lấy quận/huyện
   - Sử dụng `districtID` để lấy phường/xã
   - Sử dụng `wardCode` (không phải wardID) để tạo đơn vận chuyển GHN

3. **Error Handling**: 
   - Nếu `code != 200`, API sẽ throw `BadRequestException` với message tương ứng
   - Frontend nên handle lỗi và hiển thị thông báo phù hợp

4. **Performance**: 
   - Có thể cache dữ liệu tỉnh/thành phố và quận/huyện (ít thay đổi)
   - Phường/xã có thể thay đổi thường xuyên hơn, nên cache ngắn hạn

---

## Base URL

Thay `https://api.example.com` bằng base URL thực tế của API trong môi trường:
- **Development**: `http://localhost:5000` (hoặc port tương ứng)
- **Production**: URL production của bạn

---

**Last Updated**: 2024

