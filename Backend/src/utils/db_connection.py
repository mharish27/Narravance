from sqlalchemy import create_engine, MetaData, Table, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, distinct
import pandas as pd

# Full path to your SQLite database file
DATABASE_URL = "sqlite:////Users/harishkumar/Desktop/db_threat.db"

# Create the SQLAlchemy engine with proper settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Allow access from different threads
    pool_pre_ping=True,
)

# Enable WAL mode when a connection is created
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.close()
    except Exception as e:
        print(f"Warning: Could not set journal_mode=WAL due to: {e}")

# Reflect existing database structure
metadata = MetaData()
metadata.reflect(bind=engine)

# Create a session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
TABLE_NAME = "table_thread" 

# Reference to the target table
your_table = Table(TABLE_NAME, metadata, autoload_with=engine)


def insert_threat_data(df: pd.DataFrame):
    """
    Inserts rows from the given DataFrame into the specified table.
    Assumes DataFrame columns match table columns.
    """
    session = SessionLocal()
    try:

        # Convert Timestamp/datetime columns to string (ISO format)
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')

        # Convert DataFrame to dictionary format
        data_to_insert = df.to_dict(orient="records")

        # Perform the insert
        session.execute(your_table.insert(), data_to_insert)
        session.commit()
        print("Data inserted successfully.")
    except Exception as e:
        session.rollback()
        print(f"Error inserting data: {e}")
    finally:
        session.close()

def task_exists(task_name: str) -> bool:
    session = SessionLocal()
    try:
        query = your_table.select().where(your_table.c.task_name == task_name)
        result = session.execute(query).fetchone()
        return result is not None
    except Exception as e:
        print(f"Error checking if task exists: {e}")
        return False
    finally:
        session.close()

def get_all_task_names():
    session = SessionLocal()
    try:
        query = select(distinct(your_table.c.task_name))
        result = session.execute(query).scalars().all()
        return result
    except Exception as e:
        print(f"Error fetching task names: {e}")
        return []
    finally:
        session.close()

def fetch_task_data(task_name: str):
    session = SessionLocal()
    try:
        query = your_table.select().where(your_table.c.task_name == task_name)
        result = session.execute(query).mappings().all()

        print(f"Fetched {len(result)} rows for task '{task_name}'.")

        # Convert to list of dicts
        return [
            {
                "country": row["country"],
                "discovery_date": row["discovery_date"],
                "source": row["source"],
                "risk_level": row["risk_level"],
                "task_name": row["task_name"],
            }
            for row in result
        ]
    except Exception as e:
        print(f"Error fetching task data: {e}")
        return []
    finally:
        session.close()

