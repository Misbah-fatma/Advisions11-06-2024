import React, { useState } from 'react';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  CssBaseline,
} from '@mui/material';

import Sidebar from '../SideBarMl';



function Classification() {
 

  return (
    <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
      <CssBaseline />
      <div className="app-main">
        <Sidebar />
        <div className="app-main-outer">
          <div className="app-main-inner">
            <div className="page-title-actions px-3 d-flex">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">AI Model</li>
                </ol>
              </nav>
            </div>
            <div className="row" id="deleteTableItem">
              <div className="col-md-12">
                <div className="card mb-5">
                  <div className="card-body">
                    <Container maxWidth="xl" spacing={2}>
                      <Typography variant="h4" gutterBottom align="center" mt={4}>
                      <strong> Classification: Detailed Explanation </strong> 
                      </Typography>
                      <Typography variant="body1" paragraph mt={4}>
                        Classification is a supervised learning technique used to predict categorical labels of new instances based on past observations. The output variable in classification is a category, such as "spam" or "not spam", "disease" or "no disease".
                      </Typography>
                      
                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        Working Principles of Classification
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <ul>
                          <li>Data Collection: Gather a dataset with features (input variables) and target variable (class labels).</li>
                          <li>Data Preprocessing: Handle missing values, remove duplicates, normalize/standardize features, and encode categorical variables.</li>
                          <li>Feature Selection/Extraction: Select relevant features or create new ones to improve model performance.</li>
                          <li>Model Selection: Choose a suitable classification algorithm such as Logistic Regression, Decision Trees, Random Forest, SVM, Naive Bayes, KNN, or Neural Networks.</li>
                          <li>Training the Model: Use the training data to teach the model to map input features to target labels.</li>
                          <li>Evaluation: Assess the model’s performance using metrics like Accuracy, Precision, Recall, and F1 Score.</li>
                          <li>Hyperparameter Tuning: Optimize the model's hyperparameters to improve performance.</li>
                          <li>Deployment: Deploy the trained model to make predictions on new data.</li>
                        </ul>
                      </Typography>

                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        When to Use Classification
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Classification is used when the target variable is categorical and the goal is to categorize instances into distinct classes. Examples include spam detection, medical diagnosis, image classification, and sentiment analysis.
                      </Typography>

                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        Why Classification is Important
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Classification aids decision-making by categorizing data into meaningful classes, automates the sorting process, and provides insights into data structure and variable relationships.
                      </Typography>

                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        Common Algorithms for Classification
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Popular algorithms include: <br/>
                        <li>Logistic Regression: Suitable for binary classification with linear decision boundaries.</li>
    <li>Decision Trees: Easy to interpret and can handle both numerical and categorical data.</li>
    <li>Random Forest: Reduces overfitting by averaging multiple decision trees.</li>
    <li>Support Vector Machines (SVM): Effective in high-dimensional spaces with clear margins of separation.</li>
    <li>Naive Bayes: Assumes feature independence and works well with small datasets.</li>
    <li>K-Nearest Neighbors (KNN): Simple and intuitive, works well with small datasets.</li>
    <li>Neural Networks: Capable of handling complex non-linear relationships in the data.</li>

                      </Typography>

                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        How Classification Works
                      </Typography>
                      <Typography variant="body1" paragraph >
                        The model takes input features, learns to map these to target labels through parameter adjustment, and predicts class labels for new instances.<br/>
                        <li>Input Features: The model takes input features which are the characteristics or properties of the instances.</li>
    <li>Learning Process: The model learns to map these input features to the target labels by adjusting its parameters.</li>
    <li>Prediction: For a new instance, the model uses the learned mapping to predict the class label.</li>
                      </Typography>

                      <Divider />
                      
                      <Typography variant="h5" gutterBottom mt={4}>
                        Where Classification is Applied
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Applications includes: <br/>
                        <li>Spam Detection: Classifying emails as spam or not spam.</li>
    <li>Medical Diagnosis: Identifying the presence of a disease based on symptoms.</li>
    <li>Image Classification: Categorizing images into different classes, such as identifying animals in pictures.</li>
    <li>Sentiment Analysis: Determining the sentiment of text data, such as classifying reviews as positive or negative.</li>
    <li>Fraud Detection: Identifying fraudulent transactions in financial systems.</li>
                      </Typography>

                   
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Classification;
