# 📊 Data Sourcing & Visualization Web App

This project is a full-stack application that simulates data ingestion from two sources, processes the data through a task-based pipeline, stores it in a unified relational database, and presents insightful visualizations through an interactive frontend.

---

## 🚀 Features

- ✅ Create new data fetching tasks via UI  
- ✅ Simulate task queue progression (`pending → in_progress → completed`)  
- ✅ Filtered data ingestion from two external sources (Provider A & Provider B)  
- ✅ Unified SQLite schema with task tracking  
- ✅ Interactive visualizations using D3.js  

---

## 🧰 Technologies Used

### 🔧 Backend
- **FastAPI** – Fast Python web framework for APIs  
- **SQLAlchemy** – ORM for DB operations  
- **SQLite** – Lightweight local database  
- **queue/list** – In-memory job queue simulation  

### 💻 Frontend
- **React (JSX)** – Component-based UI  
- **Bootstrap** – Layout & utility classes  
- **Material UI (MUI)** – Modern UI components  
- **D3.js** – Custom data visualization (charts, legends, tooltips)  

---

## 🛠️ Backend Setup

### 1. Clone and Navigate

```bash
git clone https://github.com/your-repo-name
cd backend
```

### 2. Create Virtual Environment and Install Dependencies

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run FastAPI Server

```bash
uvicorn src.main:app --reload
```

### 4. API Endpoints

| Method | Endpoint                          | Description                                  |
|--------|-----------------------------------|----------------------------------------------|
| POST   | `/api/v1/create_task/{task_name}` | Submit task with filters for Provider A/B    |
| GET    | `/api/v1/get_task_names`          | Returns all distinct task names              |
| GET    | `/api/v1/get_task/{task_name}`    | Fetch data rows for a specific task name     |

---

## 🧪 Job Queue Simulation

- Task status progression is simulated using an in-memory queue.  
- Status flow:
  ```
  pending → in_progress → completed
  ```
- Artificial delays (`5–10 seconds`) simulate real-time data processing.

---

## 🗃️ Database (SQLite)

- DB file: `db_threat.db`  
- Managed via **SQLAlchemy**  
- Table: `table_threat`  
- Fields:
  ```sql
  country TEXT,
  discovery_date TEXT,
  source TEXT,
  risk_level INTEGER,
  task_num TEXT
  ```
- Each row is associated with a task via `task_num` (unique per submission)

---

## 🌐 Frontend Setup

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

Frontend will launch on:  
📍 `http://localhost:3000`

---

## 📄 Pages & Components

### ✅ `CreateTaskPage`
- Input task name  
- Filter for Provider A and B (year range, countries, severity/threat_level)  
- On submission: `POST /api/v1/create_task/{task_name}`

### ✅ `TasksPage`
- Sidebar with all created tasks (via `GET /api/v1/get_task_names`)  
- On task click:
  - Fetch task data (`GET /api/v1/get_task/{task_name}`)  
  - Display:
    - 📊 **Country vs Year**: Grouped bar chart (one bar per country per year)  
    - 📊 **Country vs Risk Level**: Multiple grouped bar charts (one per severity)  

---

## 📈 Visualizations (D3.js)

### 1. Country vs Year
- Grouped bar chart  
- X-axis: Year  
- Grouped by Country (consistent color)  
- Tooltip on hover  
- Country legend  

### 2. Country vs Risk Level
- 5 charts (one for each severity)  
- X-axis: Country  
- Grouped bars for each year  
- Tooltip on hover  
- Year legend  

---

## 🔄 Data Flow Overview

1. **User Submits Task**  
   - Fills filters for Provider A & B  
   - Chooses a `task_name`

2. **Backend Queue Starts**  
   - Task enters queue  
   - Artificial delay simulates processing

3. **Data is Loaded & Filtered**  
   - From local JSON (Provider A) or CSV (Provider B)

4. **Filtered Data is Stored in DB**  
   - Unified format into `table_threat`

5. **User Views Visualization**  
   - Sidebar: Select `task_name`  
   - Charts load using fetched data from backend

---

## 🛡 Future Enhancements

- [ ] Use Celery or RQ for real task queues  
- [ ] Add user authentication  
- [ ] Pagination for large datasets  
- [ ] Advanced filtering & drilldowns  
- [ ] Export chart as PDF/PNG  

---

## ✅ Conclusion

This project demonstrates a robust full-stack solution for:

- ✅ Ingesting and filtering external data  
- ✅ Simulating job-based pipelines  
- ✅ Persisting data in a relational DB  
- ✅ Presenting interactive analytics through React & D3.js  

Use this as a boilerplate or base for more advanced threat intelligence, reporting, or data monitoring systems!

---
