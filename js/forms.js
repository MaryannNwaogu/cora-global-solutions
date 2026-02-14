/* ============================================
   CORA GLOBAL SOLUTIONS - FORM VALIDATION
   ============================================ */

class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      this.setupForm(form);
    });
  }
  
  setupForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm(form, submitButton);
    });
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('change', () => this.validateField(field));
    });
  }
  
  validateForm(form, submitButton) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Clear previous errors
    fields.forEach(field => this.clearFieldError(field));
    
    // Validate all fields
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      this.submitForm(form, submitButton);
    }
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(field)} is required`;
    }
    
    // Email validation
    if (isValid && fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (isValid && fieldType === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 7) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Date validation
    if (isValid && fieldType === 'date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        isValid = false;
        errorMessage = 'Please select a future date';
      }
    }
    
    // Return date validation
    if (fieldName === 'returnDate') {
      const form = field.form;
      const departureDate = form.querySelector('[name="departureDate"]')?.value;
      
      if (isValid && departureDate && value) {
        const depDate = new Date(departureDate);
        const retDate = new Date(value);
        
        if (retDate <= depDate) {
          isValid = false;
          errorMessage = 'Return date must be after departure date';
        }
      }
    }
    
    // Number validation
    if (isValid && fieldType === 'number' && value) {
      const num = parseInt(value);
      if (isNaN(num) || num < 1) {
        isValid = false;
        errorMessage = 'Please enter a valid number';
      }
    }
    
    // Min length validation
    if (isValid && field.hasAttribute('minlength') && value) {
      const minLength = parseInt(field.getAttribute('minlength'));
      if (value.length < minLength) {
        isValid = false;
        errorMessage = `Minimum ${minLength} characters required`;
      }
    }
    
    // Show/clear error
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }
    
    return isValid;
  }
  
  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
  
  clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }
  
  getFieldLabel(field) {
    const label = field.form.querySelector(`label[for="${field.id}"]`);
    if (label) return label.textContent.replace('*', '').trim();
    return field.name.charAt(0).toUpperCase() + field.name.slice(1);
  }
  
  submitForm(form, submitButton) {
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    debugLog('Form submitted:', data);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Show success message
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
      }
      
      // Show notification
      showNotification('Thank you! We\'ll contact you within 2 hours.', 'success');
      
      // Reset form
      form.reset();
      
      // Restore button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        if (successMsg) {
          successMsg.classList.remove('show');
        }
      }, 5000);
      
      // In production, send to backend:
      // fetch('/api/submit-form', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // }).then(response => {
      //   // Handle response
      // });
    }, 1500);
  }
}

// Initialize form validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator();
});

// Utility function for debugging
function debugLog(...args) {
  if (window.CORA_DEBUG) {
    console.log('[CORA FORMS]', ...args);
  }
}
