import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    raw_input = Column(String, nullable=False)
    ip = Column(String, index=True)
    hostname = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = relationship("Scan", back_populates="target", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"), nullable=False)
    status = Column(String, default="Ready")  # Ready, Scanning, Completed, Failed
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    response_time_ms = Column(Float, nullable=True)
    total_hosts = Column(Integer, default=1)
    is_demo = Column(Integer, default=0)

    target = relationship("Target", back_populates="scans")
    ports = relationship("Port", back_populates="scan", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")


class Port(Base):
    __tablename__ = "ports"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    port_number = Column(Integer, nullable=False)
    protocol = Column(String, default="TCP")
    state = Column(String, nullable=False)  # OPEN, CLOSED, FILTERED
    service_name = Column(String, nullable=False)
    detected_version = Column(String, default="Unknown")
    risk_level = Column(String, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    exposure_category = Column(String, nullable=False)  # Public, Management, Internal, Unknown
    finding_summary = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    weakness = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="ports")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    finding_code = Column(String, nullable=False)  # e.g., NET-001
    severity = Column(String, nullable=False)  # HIGH, MEDIUM, LOW, INFO
    affected_port = Column(Integer, nullable=True)
    service_name = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    confidence = Column(String, default="HIGH")  # HIGH, MEDIUM, LOW

    scan = relationship("Scan", back_populates="findings")
