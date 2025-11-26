import pytest
import sys
import os
from unittest.mock import MagicMock

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app import app as flask_app

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def mock_gemini(mocker):
    """Mock Gemini API to avoid real calls during tests."""
    mock_model = MagicMock()
    mock_model.generate_content.return_value.text = "This is a mocked AI response."
    
    mocker.patch('app.model', mock_model)
    mocker.patch('app.genai.GenerativeModel', return_value=mock_model)
    return mock_model
