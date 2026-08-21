
        // Localization
        const STRINGS = {
            ar: {
                monthlyPayment: 'القسط الشهري',
                totalInterest: 'إجمالي الفوائد',
                totalAmount: 'إجمالي المبلغ المدفوع',
                debtRatio: 'نسبة الدين إلى الدخل',
                month: 'الشهر',
                principal: 'أصل القرض',
                interest: 'الفوائد',
                balance: 'الرصيد',
                compliant: '✅ متوافق',
                nonCompliant: '❌ يخالف اللوائح',
                riskLow: 'مخاطر منخفضة',
                riskMedium: 'مخاطر متوسطة',
                riskHigh: 'مخاطر عالية',
                riskReject: 'مرفوض'
            }
        };

        // Eskan support amount (constant)
        const ESKAN_SUPPORT_AMOUNT = 111750;

        let currentData = null;
        let option1Data = null;
        let option2Data = null;
        let activeSchedule = 'option1';

        // Standard amortization formula
        function calculateMRC(principal, annualRate, years) {
            const monthlyRate = annualRate / 12;
            const numPayments = years * 12;
            
            if (monthlyRate === 0) return principal / numPayments;
            
            const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments);
            const denominator = Math.pow(1 + monthlyRate, numPayments) - 1;
            return numerator / denominator;
        }

        function generateAmortizationTable(principal, annualRate, years, monthlyPayment) {
            const monthlyRate = annualRate / 12;
            const numPayments = years * 12;
            const table = [];
            let balance = principal;
            
            for (let month = 1; month <= numPayments; month++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                balance -= principalPayment;
                
                table.push({
                    month,
                    payment: monthlyPayment,
                    principal: principalPayment,
                    interest: interestPayment,
                    balance: Math.max(0, balance)
                });
            }
            
            return table;
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('ar-SA').format(Math.round(amount)) + ' ر.س';
        }

        function formatPercent(value) {
            return (value * 100).toFixed(2) + '%';
        }

        function assessRisk(debtRatio) {
            if (debtRatio > 0.65) {
                return { level: 'reject', text: STRINGS.ar.riskReject };
            } else if (debtRatio > 0.50) {
                return { level: 'high', text: STRINGS.ar.riskHigh };
            } else if (debtRatio > 0.35) {
                return { level: 'medium', text: STRINGS.ar.riskMedium };
            } else {
                return { level: 'low', text: STRINGS.ar.riskLow };
            }
        }

        function calculateComprehensive() {
            const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
            const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
            const loanTerm = parseInt(document.getElementById('loanTerm').value) || 0;
            const salary = parseFloat(document.getElementById('salary').value) || 0;
            const salesCommission = parseFloat(document.getElementById('salesCommission').value) || 0;
            const bankFees = parseFloat(document.getElementById('bankFees').value) || 0;
            const taxAmount = parseFloat(document.getElementById('taxAmount').value) || 0;
            const additionalFees = parseFloat(document.getElementById('additionalFees').value) || 0;
            const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked').value;

            if (!propertyPrice || !interestRate || !loanTerm || !salary) {
                alert('الرجاء إدخال جميع الحقول المطلوبة');
                return;
            }

            // Calculate down payment (10% + 10,000 SAR fee)
            const downPaymentRate = 0.10;
            const baseDownPayment = propertyPrice * downPaymentRate;
            const totalDownPayment = baseDownPayment + 10000;

            // Total fees before Eskan support
            const totalFeesBeforeSupport = salesCommission + bankFees + taxAmount + additionalFees;
            
            // Calculate Eskan support (only for married)
            const eskanSupport = maritalStatus === 'married' ? ESKAN_SUPPORT_AMOUNT : 0;
            
            // Amount needed after Eskan support
            const amountNeededBeforeSupport = totalDownPayment + totalFeesBeforeSupport;
            const finalAmountNeeded = Math.max(0, amountNeededBeforeSupport - eskanSupport);

            // Show summary
            document.getElementById('downPayment').textContent = formatCurrency(totalDownPayment);
            document.getElementById('totalFees').textContent = formatCurrency(totalFeesBeforeSupport);
            document.getElementById('amountNeeded').textContent = formatCurrency(amountNeededBeforeSupport);
            document.getElementById('amountNeededWithSupport').textContent = formatCurrency(finalAmountNeeded);

            // Option 1: Cash down payment
            const option1LoanAmount = propertyPrice - totalDownPayment;
            const option1MRC = calculateMRC(option1LoanAmount, interestRate / 100, loanTerm);
            const option1Total = option1MRC * loanTerm * 12;
            const option1TotalInterest = option1Total - option1LoanAmount;
            const option1DTI = option1MRC / salary;
            const option1NetSalary = salary - option1MRC;

            // Option 2: Personal loan for down payment
            const personalLoanYears = 5;
            const personalLoanRate = 0.028; // 2.8%
            const maxPersonalLoan = (salary / 3) * personalLoanYears * 12; // (salary/3)*5*12
            const personalLoanAmount = Math.min(finalAmountNeeded, maxPersonalLoan);
            const personalLoanMRC = calculateMRC(personalLoanAmount, personalLoanRate, personalLoanYears);
            
            const option2HouseLoanAmount = propertyPrice - totalDownPayment;
            const option2HouseMRC = calculateMRC(option2HouseLoanAmount, interestRate / 100, loanTerm);
            const option2CombinedMRC_5years = personalLoanMRC + option2HouseMRC;
            const option2DTI_5years = option2CombinedMRC_5years / salary;
            const option2NetSalary = salary - option2CombinedMRC_5years;

            // Store data
            option1Data = {
                loanAmount: option1LoanAmount,
                mrc: option1MRC,
                totalInterest: option1TotalInterest,
                totalAmount: option1Total,
                dti: option1DTI,
                netSalary: option1NetSalary,
                eskanSupport: eskanSupport,
                amortization: generateAmortizationTable(option1LoanAmount, interestRate / 100, loanTerm, option1MRC)
            };

            option2Data = {
                personalLoanAmount: personalLoanAmount,
                personalMRC: personalLoanMRC,
                houseLoanAmount: option2HouseLoanAmount,
                houseMRC: option2HouseMRC,
                combinedMRC: option2CombinedMRC_5years,
                dti: option2DTI_5years,
                netSalary: option2NetSalary,
                eskanSupport: eskanSupport,
                houseAmortization: generateAmortizationTable(option2HouseLoanAmount, interestRate / 100, loanTerm, option2HouseMRC)
            };

            // Populate comparison table
            populateComparisonTable(option1Data, option2Data);
            
            // Populate risk assessment
            populateRiskAssessment(option1Data, option2Data);
            
            // Show sections
            document.getElementById('noResults').classList.add('hidden');
            document.getElementById('results').classList.remove('hidden');
            document.getElementById('scheduleSection').classList.remove('hidden');
            
            // Show schedule for option 1 by default
            showSchedule('option1');
        }

        function populateComparisonTable(option1, option2) {
            const tbody = document.getElementById('comparisonBody');
            tbody.innerHTML = '';

            const rows = [
                { label: 'مبلغ القرض', val1: option1.loanAmount, val2: option2.houseLoanAmount },
                { label: 'القسط الشهري (MRC)', val1: option1.mrc, val2: option2.houseMRC },
                { label: 'إجمالي الفوائد', val1: option1.totalInterest, val2: (option2.houseMRC * 20 * 12) - option2.houseLoanAmount },
                { label: 'إجمالي المبلغ المدفوع', val1: option1.totalAmount, val2: option2.houseMRC * 20 * 12 },
                { label: 'نسبة الدين إلى الدخل (DTI)', val1: option1.dti, val2: option2.dti, isPercent: true },
                { label: 'دعم إسكان المخصص', val1: option1.eskanSupport, val2: option2.eskanSupport },
                { label: 'صافي الراتب الشهري', val1: option1.netSalary, val2: option2.netSalary },
                { label: 'مبلغ القرض الشخصي', val1: 0, val2: option2.personalLoanAmount },
                { label: 'قسط القرض الشخصي', val1: 0, val2: option2.personalMRC },
                { label: 'القسط المجمع (5 سنوات)', val1: option1.mrc, val2: option2.combinedMRC, isCombined: true }
            ];

            rows.forEach(row => {
                const tr = document.createElement('tr');
                let diff = '';
                const val2Display = row.val2 !== undefined ? row.val2 : row.val1;
                
                if (row.val2 !== undefined) {
                    if (row.isPercent) {
                        diff = formatPercent((row.val2 - row.val1));
                    } else {
                        diff = formatCurrency(row.val2 - row.val1);
                    }
                }

                tr.innerHTML = `
                    <td><strong>${row.label}</strong></td>
                    <td>${row.isPercent ? formatPercent(row.val1) : formatCurrency(row.val1)}</td>
                    <td>${row.isPercent ? formatPercent(val2Display) : (row.isCombined ? formatCurrency(val2Display) : formatCurrency(val2Display))}</td>
                    <td>${diff}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        function populateRiskAssessment(option1, option2) {
            const risk1 = assessRisk(option1.dti);
            const risk2 = assessRisk(option2.dti);
            
            document.getElementById('option1Risk').innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>الخيار 1: دفعة كاش</strong><br>
                    DTI: ${formatPercent(option1.dti)} 
                    <span class="risk-indicator risk-${risk1.level}">${risk1.text}</span>
                    ${option1.dti <= 0.65 ? '<span class="compliance-badge compliant">' + STRINGS.ar.compliant + '</span>' : '<span class="compliance-badge non-compliant">' + STRINGS.ar.nonCompliant + '</span>'}<br>
                    صافي الراتب: ${formatCurrency(option1.netSalary)}
                </div>
            `;
            
            document.getElementById('option2Risk').innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>الخيار 2: قرض شخصي</strong><br>
                    DTI (5 سنوات): ${formatPercent(option2.dti)} 
                    <span class="risk-indicator risk-${risk2.level}">${risk2.text}</span>
                    ${option2.dti <= 0.65 ? '<span class="compliance-badge compliant">' + STRINGS.ar.compliant + '</span>' : '<span class="compliance-badge non-compliant">' + STRINGS.ar.nonCompliant + '</span>'}<br>
                    صافي الراتب: ${formatCurrency(option2.netSalary)}
                </div>
            `;
        }

        function showSchedule(option) {
            activeSchedule = option;
            const buttons = document.querySelectorAll('#scheduleTabs button');
            buttons.forEach((btn, index) => {
                btn.classList.toggle('active', (option === 'option1' && index === 0) || (option === 'option2' && index === 1));
            });
            
            const tbody = document.getElementById('scheduleBody');
            tbody.innerHTML = '';
            
            const data = option === 'option1' ? option1Data : option2Data;
            const table = option === 'option1' ? data.amortization : data.houseAmortization;
            
            // Show first 60 months
            for (let i = 0; i < Math.min(60, table.length); i++) {
                const row = table[i];
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.month}</td>
                    <td>${formatCurrency(row.payment)}</td>
                    <td>${formatCurrency(row.principal)}</td>
                    <td>${formatCurrency(row.interest)}</td>
                    <td>${formatCurrency(row.balance)}</td>
                `;
                tbody.appendChild(tr);
            }
            
            if (table.length > 60) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 15px;">
                        عرض 60 من ${table.length} شهر
                    </td>
                `;
                tbody.appendChild(tr);
            }
            
            // Update summary
            updateScheduleSummary(option);
            
            // Show risk assessment
            document.getElementById('riskAssessment').classList.remove('hidden');
            document.getElementById('recommendations').classList.remove('hidden');
        }

        function updateScheduleSummary(option) {
            const data = option === 'option1' ? option1Data : option2Data;
            const table = option === 'option1' ? data.amortization : data.houseAmortization;
            const totalPaid = (data.mrc || data.houseMRC) * 20 * 12;
            
            const summaryDiv = document.getElementById('scheduleSummary');
            summaryDiv.innerHTML = `
                <div class="summary-card">
                    <div class="value">${formatCurrency(data.loanAmount || data.houseLoanAmount)}</div>
                    <div class="label">مبلغ القرض</div>
                </div>
                <div class="summary-card">
                    <div class="value">${formatCurrency(data.mrc || data.houseMRC)}</div>
                    <div class="label">القسط الشهري</div>
                </div>
                <div class="summary-card">
                    <div class="value">${formatCurrency(totalPaid)}</div>
                    <div class="label">إجمالي المدفوعات</div>
                </div>
                <div class="summary-card">
                    <div class="value">${Math.round(20 * 12)}</div>
                    <div class="label">عدد الأشهر</div>
                </div>
            `;
        }

        function clearForm() {
            document.getElementById('propertyPrice').value = '1450000';
            document.getElementById('interestRate').value = '3.89';
            document.getElementById('loanTerm').value = '20';
            document.getElementById('salary').value = '30000';
            document.getElementById('salesCommission').value = '36250';
            document.getElementById('bankFees').value = '8000';
            document.getElementById('taxAmount').value = '211750';
            document.getElementById('additionalFees').value = '0';
            document.getElementById('single').checked = true;
            
            document.getElementById('noResults').classList.remove('hidden');
            document.getElementById('results').classList.add('hidden');
            document.getElementById('scheduleSection').classList.add('hidden');
            
            currentData = null;
            option1Data = null;
            option2Data = null;
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listener for property price to auto-calculate tax
            document.getElementById('propertyPrice').addEventListener('input', function() {
                const price = parseFloat(this.value) || 0;
                if (price > 1000000) {
                    // Tax is applied on amount above 1M (approximate calculation)
                    const taxableAmount = price - 1000000;
                    // Using the ratio from Excel: 211750 / 1450000 ≈ 14.6%
                    const estimatedTax = Math.round(taxableAmount * 0.146);
                    document.getElementById('taxAmount').value = estimatedTax;
                } else {
                    document.getElementById('taxAmount').value = '0';
                }
            });
        });
