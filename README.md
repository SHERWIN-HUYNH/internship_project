# 🕵️ Missing Person Tracing System based on Deep Learning

## 📝 Tổng quan dự án
[cite_start]Hệ thống **MPTS** được xây dựng nhằm giải quyết thách thức trong việc tìm kiếm người mất tích thông qua nền tảng tự động hóa kết hợp Trí tuệ nhân tạo (Deep Learning) và cơ sở dữ liệu tập trung[cite: 1542, 1547]. [cite_start]Hệ thống cho phép đối chiếu khuôn mặt từ hình ảnh chụp ngẫu nhiên trong cộng đồng với kho dữ liệu khổng lồ để xác định danh tính với độ chính xác cao[cite: 1550, 1551].

## ✨ Tính năng nổi bật
* [cite_start]**Thu thập dữ liệu tự động:** Tích hợp framework **Scrapy** để cào dữ liệu từ các nguồn quốc tế uy tín như Interpol, Garda, Global Missing Kids [cite: 1815, 1912-1916].
* [cite_start]**Pipeline xử lý đa tầng:** Kết hợp **MTCNN** để phát hiện, căn chỉnh khuôn mặt và **FaceNet** để trích xuất vector đặc trưng[cite: 2002, 2014, 2134].
* [cite_start]**Tìm kiếm tương đồng (Similarity Search):** Sử dụng khoảng cách Euclidean ($L2$) để so khớp vector nhúng 512 chiều trong không gian đa chiều[cite: 1628, 2016, 2157].
* [cite_start]**Quản lý dữ liệu linh hoạt:** Chuyển đổi từ MySQL sang **MongoDB** để tối ưu hóa việc lưu trữ dữ liệu dạng vector và tăng tốc độ đọc/ghi [cite: 1971-1973].
* [cite_start]**Hạ tầng đám mây:** Triển khai trên **AWS** (S3 để lưu trữ hình ảnh, EC2 để xử lý) đảm bảo khả năng mở rộng hệ thống [cite: 1844-1847].

## 🛠 Công nghệ sử dụng
* **AI Models:**
    * [cite_start]**MTCNN:** Phát hiện và căn chỉnh khuôn mặt dựa trên 5 điểm mốc (landmarks)[cite: 1725, 2005, 2039].
    * [cite_start]**FaceNet (Inception ResNetV1):** Fine-tuned trên tập dữ liệu VGGFace2 để tạo ra 512-D embedding [cite: 2016, 2043-2044].
    * [cite_start]**StyleCLIP & SSIM:** Nghiên cứu ứng dụng trong việc chỉnh sửa ảnh và đo lường độ tương đồng cấu trúc hình ảnh[cite: 1765, 1794].
* [cite_start]**Backend & Database:** Python, MongoDB, MySQL, Scrapy[cite: 1818, 1856, 1886].
* [cite_start]**Deployment:** Docker, AWS (S3, EC2, Lambda)[cite: 1846, 2037].

## 📊 Kết quả đạt được
* [cite_start]**Dataset:** Xây dựng kho dữ liệu sạch gồm **13,123** hồ sơ và **16,981** hình ảnh sau khi tiền xử lý[cite: 1988, 1994].
* **Hiệu suất mô hình:**
    * [cite_start]Đạt độ chính xác (Accuracy) trung bình từ **80% - 95%** trên tập kiểm tra[cite: 2130, 2736].
    * [cite_start]Mô hình hội tụ tốt sau 20 epoch với validation loss giảm xuống còn **1.1343**[cite: 2128, 2736].
* [cite_start]**Tối ưu hóa:** Phát triển thuật toán tiền xử lý loại bỏ các mẫu nhiễu, link hỏng và ảnh không phát hiện được mặt để đảm bảo chất lượng vector hóa [cite: 1975-1978].

## 🏗 Kiến trúc hệ thống
Hệ thống hoạt động theo pipeline 3 giai đoạn:
1. [cite_start]**Tiền xử lý:** Phát hiện mặt bằng MTCNN $\rightarrow$ Crop & Align ($160 \times 160$) $\rightarrow$ Chuẩn hóa pixel [cite: 2004-2007].
2. [cite_start]**Trích xuất đặc trưng:** FaceNet chuyển hóa ảnh thành vector 512 chiều[cite: 2016, 2156].
3. [cite_start]**So khớp:** So sánh vector truy vấn $q$ với các vector $d$ trong cơ sở dữ liệu qua ngưỡng (threshold) định trước [cite: 2157-2158].

## 🚀 Hướng phát triển tương lai
* [cite_start]Mở rộng dữ liệu huấn luyện với các mẫu ảnh đa dạng về góc độ và điều kiện ánh sáng [cite: 2743-2744].
* [cite_start]Tích hợp các phương pháp khử nhiễu để xử lý ảnh mờ/nhiễu từ camera an ninh cộng đồng[cite: 2745].
* [cite_start]Phát triển tính năng tìm kiếm đa phương thức (Multimodal Search) qua mô tả văn bản[cite: 1551].

## 👥 Thành viên thực hiện
* [cite_start]**Huỳnh Chí Trung** - AI Engineer (Model development, System architecture)[cite: 1462, 1500].
* [cite_start]**Kiều Tuấn Trung Anh** - AI Engineer (Data engineering, UI design)[cite: 1463, 1500].
