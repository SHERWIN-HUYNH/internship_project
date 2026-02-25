# 🕵️ Missing Person Tracing System based on Deep Learning

## 📝 Tổng quan dự án
Hệ thống **MPTS** được xây dựng nhằm giải quyết thách thức trong việc tìm kiếm người mất tích thông qua nền tảng tự động hóa kết hợp Trí tuệ nhân tạo (Deep Learning) và cơ sở dữ liệu tập trung. Hệ thống cho phép đối chiếu khuôn mặt từ hình ảnh chụp ngẫu nhiên trong cộng đồng với kho dữ liệu khổng lồ để xác định danh tính với độ chính xác cao.

## ✨ Tính năng nổi bật
* **Thu thập dữ liệu tự động:** Tích hợp framework **Scrapy** để cào dữ liệu từ các nguồn quốc tế uy tín như Interpol, Garda, và Global Missing Kids.
* **Pipeline xử lý đa tầng:** Kết hợp **MTCNN** để phát hiện, căn chỉnh khuôn mặt và **FaceNet** để trích xuất vector đặc trưng.
* **Tìm kiếm tương đồng (Similarity Search):** Sử dụng khoảng cách Euclidean ($L_2$) để so khớp vector nhúng 512 chiều trong không gian đa chiều.
* **Quản lý dữ liệu linh hoạt:** Sử dụng **MongoDB** thay cho MySQL để tối ưu hóa việc lưu trữ dữ liệu dạng vector và tăng tốc độ truy vấn.
* **Hạ tầng đám mây:** Triển khai trên **AWS** (S3 để lưu trữ hình ảnh, EC2 để xử lý) đảm bảo khả năng mở rộng hệ thống.

## 🛠 Công nghệ sử dụng
* **AI Models:**
    * **MTCNN:** Phát hiện và căn chỉnh khuôn mặt dựa trên 5 điểm mốc (landmarks).
    * **FaceNet (Inception ResNetV1):** Fine-tuned trên tập dữ liệu VGGFace2 để tạo ra 512-D embedding.
    * **StyleCLIP & SSIM:** Nghiên cứu ứng dụng trong việc chỉnh sửa ảnh và đo lường độ tương đồng cấu trúc hình ảnh.
* **Backend & Database:** Python, MongoDB, MySQL, Scrapy.
* **Deployment:** Docker, AWS (S3, EC2).

## 📊 Kết quả đạt được
* **Dataset:** Xây dựng kho dữ liệu sạch gồm **13,123** hồ sơ và **16,981** hình ảnh sau khi tiền xử lý.
* **Hiệu suất mô hình:**
    * Đạt độ chính xác (Accuracy) trung bình từ **80% - 95%** trên tập kiểm tra.
    * Mô hình hội tụ tốt sau 20 epoch với validation loss giảm xuống còn **1.1343**.
* **Tối ưu hóa:** Phát triển thuật toán tiền xử lý loại bỏ các mẫu nhiễu, link hỏng và ảnh không phát hiện được mặt để đảm bảo chất lượng vector hóa.

## 🏗 Kiến trúc hệ thống
Hệ thống hoạt động theo pipeline 3 giai đoạn:
1. **Tiền xử lý:** Phát hiện mặt bằng MTCNN -> Crop & Align ($160 \times 160$) -> Chuẩn hóa giá trị pixel.
2. **Trích xuất đặc trưng:** FaceNet chuyển hóa ảnh khuôn mặt thành vector đặc trưng 512 chiều.
3. **So khớp:** So sánh vector truy vấn với cơ sở dữ liệu dựa trên ngưỡng (threshold) định trước để trả về kết quả liên quan nhất.

## 🚀 Hướng phát triển tương lai
* Mở rộng dữ liệu huấn luyện với các mẫu ảnh đa dạng về góc độ và điều kiện ánh sáng.
* Tích hợp các phương pháp khử nhiễu để xử lý ảnh mờ từ camera an ninh cộng đồng.
* Phát triển tính năng tìm kiếm đa phương thức (Multimodal Search) qua mô tả bằng văn bản.

## 👥 Thành viên thực hiện
* **Huỳnh Chí Trung** - AI Engineer (Model development, System architecture).
* **Kiều Tuấn Trung Anh** - AI Engineer (Data engineering, UI design).
